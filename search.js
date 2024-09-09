function isCategoryMatch(venueDBLPURL, categoryList) {
    let match = false;
    if (categoryList.length == 0) {
        match = true;
    } else {
        for (let category of categoryList) {
            if (CATEGORY_LIST[category].hasOwnProperty(venueDBLPURL)) {
                match = true;
                break;
            }
        }
    }
    return match;
}

function isTypeMatch(venueDBLPURL, typeList) {
    let match = false;
    if (typeList.length == 0) {
        match = true;
    } else {
        for (let type of typeList) {
            if (venueDBLPURL.startsWith(type)) {
                match = true;
                break;
            }
        }
    }
    return match;
}

function isRankMatch(venueDBLPURL, rankList) {
    return rankList.length == 0 || rankList.includes(CCF_LIST[venueDBLPURL].rank);
}

function isVenueMatch(venueDBLPURL, venueList) {
    return venueList.length == 0 || venueList.includes(venueDBLPURL);
}

function isYearRange(year, startYear, endYear) {
    if (startYear.length == 0 && endYear.length == 0) {
        return true;
    }
    if (startYear.length > 0 && endYear.length > 0) {
        return parseInt(startYear) <= year && year <= parseInt(endYear);
    }
    if (startYear.length > 0) {
        return parseInt(startYear) <= year;
    }
    return year <= parseInt(endYear);
}

function isEmpty(str) {
    return !str || str.length === 0;
}

function doSearch(query, firstHit, pageSize, total, paperList, filter, fillPaperListCallback) {
    let request_url = "https://dblp.uni-trier.de/search/publ/api?callback=?";
    let inputData = {
        q: query,
        c: 0,
        f: firstHit,
        h: pageSize,
        format: "jsonp",
    };
    $.getJSON(request_url, inputData, function (data) {
        let result = data["result"];
        if (parseInt(result["status"]["@code"]) != 200) {
            return;
        }

        total = parseInt(result["hits"]["@total"]);
        let size = parseInt(result["hits"]["@sent"]);
        // When reaching the upper limit -- 100000 hits
        if (size > 0) {
            let curPaperList = result["hits"]["hit"];
            for (var i = 0; i < curPaperList.length; i++) {
                let paper = curPaperList[i]["info"];
                let year = parseInt(paper["year"]);
                let slashIdx = paper["key"].lastIndexOf("/");
                let venueDBLPURL = paper["key"].substr(0, slashIdx);

                // Ignore some irrelevant information
                if (
                    paper.title &&
                    paper.title.match(/[p|P]roceeding|[w|W]orkshop|[c|C]onference/g)
                ) {
                    continue;
                }

                // Whether the key or venue hits or not
                let matchCCFList = CCF_LIST.hasOwnProperty(venueDBLPURL);

                if (filter.categoryList.length > 0
                    || filter.rankList.length > 0
                    || filter.venueList.length > 0) {
                    if (!matchCCFList) {
                        continue;
                    }

                    // 根据分类过滤   
                    if (!isCategoryMatch(venueDBLPURL, filter.categoryList)) {
                        continue;
                    }

                    // 根据级别过滤
                    if (!isRankMatch(venueDBLPURL, filter.rankList)) {
                        continue;
                    }

                    // 根据刊物过滤
                    if (!isVenueMatch(venueDBLPURL, filter.venueList)) {
                        continue;
                    }
                }

                // 根据刊物类别过滤
                if (!isTypeMatch(venueDBLPURL, filter.typeList)) {
                    continue;
                }

                // 根据年份过滤
                if (!isYearRange(year, filter.year.start, filter.year.end)) {
                    continue;
                }

                let ccfRank;
                let venueName = "";
                if (matchCCFList) {
                    ccfRank = CCF_LIST[venueDBLPURL]["rank"];
                    venueName = CCF_LIST[venueDBLPURL]["venue"];
                } else {
                    if (paper.venue) {
                        if (paper.venue instanceof Array) {
                            venueName = paper.venue[0].toUpperCase();
                        } else {
                            venueName = paper.venue.toUpperCase();
                        }
                    }
                }

                let firstAuthor = "";
                if (paper.authors) {
                    if (paper.authors.author instanceof Array) {
                        firstAuthor = paper.authors.author[0].text;
                    } else {
                        firstAuthor = paper.authors.author.text;
                    }
                }
                firstAuthor = firstAuthor.replace(/\d+/g, "").trim();
                let title = paper["title"].replace(/['"]+/g, "").replace(/\.$/, "");
                let url;
                if (paper["ee"]) {
                    url = paper["ee"];
                } else {
                    // not available
                    url = "javascript:void(0)";
                }

                paperList.push({
                    ccfRank: ccfRank,
                    title: title,
                    firstAuthor: firstAuthor,
                    venue: venueName,
                    year: paper["year"],
                    url: url,
                    doi: paper["doi"],
                    abstractId: title.replace(/[^a-zA-Z]+/g, "_"),
                });
            }

            // recursion
            if (firstHit + size < total) {
                doSearch(query, firstHit + pageSize, pageSize, total, paperList, filter, fillPaperListCallback);
                return;
            }
        }

        // 排序
        paperList.sort(function (a, b) {
            if (a.year != b.year) {
                return b.year - a.year;
            }
            if (a.venue != b.venue) {
                return a.venue.localeCompare(b.venue);
            }
            return a.title.localeCompare(b.title);
        });

        // 执行回调函数，填充论文列表
        fillPaperListCallback(paperList);
    })
        .fail(function (jqXHR, textStatus, errorThrown) {
            let alertHtml = template.render($("#alertTemplate").html(), {
                title: "提示信息",
                message: "请求失败，请重新尝试！"
            });
            $("#alert").html(alertHtml);
            $('#alert').modal();

            // 当请求失败时，不要继续显示加载图片
            $("#tips").empty();
        });
}

function search(fillPaperListCallback) {
    let invalidClass = "is-invalid";
    let invalid = false;

    // 验证关键词
    let $searchFeedback = $(".search-feedback");
    $(".q").each(function (index) {
        let $input = $(this);

        let query = $input.val().trim();
        let isEmpty = query == "";
        let hasChineseCharacter = query.match(/[\u4E00-\u9FA5]|[\uF900-\uFA2D]/);

        if (isEmpty || hasChineseCharacter) {
            invalid = true;
            $input.addClass(invalidClass);

            let errorMsg = isEmpty ? "关键词不能为空！" : "DBLP不支持中文关键词！";
            $feedback = $searchFeedback.eq(index);
            $feedback.text(errorMsg);
        } else {
            $input.removeClass(invalidClass);
        }
    });

    // 验证起止年份
    let $startYear = $("#startYear");
    let $endYear = $("#endYear");
    let startYearStr = $startYear.val().trim();
    let endYearStr = $endYear.val().trim();
    let isStartYearEmpty = isEmpty(startYearStr);
    let isEndYearEmpty = isEmpty(endYearStr);

    function handleYear($year, index) {
        let currentYear = new Date().getFullYear()
        let errorMsg = `年份必须位于 (0, ${currentYear}] 区间内！`;
        let yearStr = $year.val().trim();
        let yearVal = parseInt(yearStr);
        let isYearInvalid = !isEmpty(yearStr) && (yearVal <= 0 || yearVal > currentYear);
        let $yearFeedback = $(".year-feedback").eq(index);

        if (isYearInvalid) {
            $year.addClass(invalidClass);
            $yearFeedback.text(errorMsg);
        } else {
            $year.removeClass(invalidClass);
            $yearFeedback.empty();
        }

        return isYearInvalid;
    }

    if (!isStartYearEmpty || !isEndYearEmpty) {
        let isStartYearInvalid = handleYear($startYear, 0);
        let isEndYearInvalid = handleYear($endYear, 1);
        if (isStartYearInvalid || isEndYearInvalid) {
            invalid = true;
        } else if (!isStartYearEmpty && !isEndYearEmpty
            && parseInt(startYearStr) > parseInt(endYearStr)) {
            $startYear.addClass(invalidClass);
            $endYear.addClass(invalidClass);
            $(".year-feedback").eq(0).text("开始年份必须≤结束年份！");

            invalid = true;
        }
    } else {
        $startYear.removeClass(invalidClass);
        $endYear.removeClass(invalidClass);
        $(".year-feedback").each(function (index) {
            $(this).empty();
        });
    }

    // 如果关键词和起止年份存在问题，则提前返回
    if (invalid) {
        return;
    }

    // 显示加载图片，并清空查询结果
    $("#tips").html($("#loadingTipsTemplate").html());
    $("#result").empty();

    // 拼接查询字符串
    let query = "";
    $(".q").each(function (index) {
        let val = $(this).val().trim();
        if (index == 0) {
            query += val;
        } else {
            let condition = $(".condition").eq(index - 1).val();
            switch (condition) {
                case "and":
                    query += " " + val;
                    break;
                case "or":
                    query += "|" + val;
                    break;
            }
        }
    });
    // 判断是否需要显示查询字符串
    if ($("#queryStringInput").prop("checked")) {
        $("#queryString").text(query);
    } else {
        $("#queryString").empty();
    }

    let firstHit = 0;
    // DBLP允许的最大值为1000
    let pageSize = 1000;
    let total = 0;
    let paperList = [];
    let filter = {
        categoryList: $("#category").val(),
        typeList: $("#type").val(),
        rankList: $("#rank").val(),
        venueList: $("#venue").val(),
        year: {
            start: startYearStr,
            end: endYearStr
        }
    };

    doSearch(query, firstHit, pageSize, total, paperList, filter, fillPaperListCallback);
}

function queryAbstract(paperDOI, paperTitle = null, abstractSelector) {
    // read cache if exists
    let $abstractTag = $(abstractSelector);
    if ($abstractTag.html()) {
        if ($abstractTag.css("display") == "block") {
            $abstractTag.css("display", "none");
        } else {
            $abstractTag.css("display", "block");
        }
        return;
    }

    // init
    let $loadingTips = $(abstractSelector + "tips");
    $loadingTips.html($("#loadingTipsTemplate").html());
    let errorMsg = "没找到摘要=_=";

    // query
    doQueryAbstract(
        paperDOI,
        paperTitle,
        $abstractTag,
        $loadingTips,
        errorMsg
    );
}

function doQueryAbstract(
    paperDOI,
    paperTitle,
    $abstractTag,
    $loadingTips,
    errorMsg
) {
    let semanticScholarUrl = "https://api.semanticscholar.org/graph/v1/paper/";
    let inputData = {
        fields: "title,abstract",
    };

    if (paperDOI.trim().length > 0) {
        semanticScholarUrl += "DOI:" + paperDOI;
    } else {
        semanticScholarUrl += "search";
        inputData["query"] = paperTitle;
        inputData["limit"] = 1;
        inputData["fieldsOfStudy"] = "Computer Science";
    }

    $.getJSON(semanticScholarUrl, inputData, function (data) {
        let abstract;
        // 如果doi搜索不到，那么按标题搜索
        if (paperDOI.trim().length > 0) {
            if (!data["abstract"]) {
                doQueryAbstract(
                    "",
                    paperTitle,
                    $abstractTag,
                    $loadingTips,
                    errorMsg
                );
                return;
            }
            abstract = data["abstract"];
        } else {
            if (data["total"] == 0 || !data["data"][0]["abstract"]) {
                $abstractTag.html(errorMsg);
                $loadingTips.empty();
                return;
            }

            let paper = data["data"][0];
            abstract = paper["abstract"];
        }

        $abstractTag.html(abstract);
        $loadingTips.empty();
    })
        .fail(function (jqXHR, textStatus, errorThrown) {
            let alertHtml = template.render($("#alertTemplate").html(), {
                title: "提示信息",
                message: "请求失败，请重新尝试！"
            });
            $("#alert").html(alertHtml);
            $('#alert').modal();

            $loadingTips.empty();
        });
}
