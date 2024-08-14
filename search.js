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

function doSearch(query, firstHit, pageSize, total, paperList, filter) {
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
                
                if (filter.category.length > 0 
                    || filter.rank.length > 0 
                    || filter.venue.length > 0) {
                    if (!matchCCFList) {
                        continue;
                    }

                    let match = false;
                    if (filter.category.length > 0) {
                        for (let category of filter.category) {
                            if (CATEGORY_LIST[category].hasOwnProperty(venueDBLPURL)) {
                                if (filter.rank.length > 0) {
                                    if (filter.rank.includes(CATEGORY_LIST[category][venueDBLPURL].rank)) {
                                        if (filter.venue.length == 0 || filter.venue.includes(venueDBLPURL)) {
                                            match = true;
                                            break;
                                        }
                                    }
                                } else if (filter.venue.length > 0) {
                                    if (filter.venue.includes(venueDBLPURL)) {
                                        match = true;
                                        break;
                                    }
                                } else {
                                    match = true;
                                }
                            }
                        }
                    } else if (filter.rank.length > 0) {
                        if (filter.rank.includes(CCF_LIST[venueDBLPURL].rank)) {
                            if (filter.venue.length == 0 || filter.venue.includes(venueDBLPURL)) {
                                match = true;
                            }
                        }
                    }
                    if (!match) {
                        continue;
                    }
                }

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
                let title = paper["title"].replace(/['"\.]+/g, "");
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
                doSearch(query, firstHit + pageSize, pageSize, total, paperList, filter);
                return ;
            }
        }

        // 排序
        // TODO: 允许用户在网页上指定排序方式
        paperList.sort(function(a, b) {
            if (a.year != b.year) {
                return b.year - a.year;
            }
            if (a.venue != b.venue) {
                return a.venue.localeCompare(b.venue);
            }
            return a.title.localeCompare(b.title);
        });

        let tips = template.render($("#response-tips-info-template").html(), {
            count: Object.keys(paperList).length,
        });
        $("#tips").html(tips);

        let html = template.render($("#paper-info-template").html(), {
            paperList: paperList,
        });
        $("#result").append(html);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        alert("请求失败，请重新尝试！");
        // 当请求失败时，不要继续显示加载图片
        $("#tips").empty();
    });
}

function search() {
    // trim q
    let query = $("#q").val().trim();
    // 1.check whether q is null or not
    // 2.ensure that string q is not a chinese character sequence
    // TODO: 使用更好的校验及展示方式
    if (query == "" || query.search(/[\u4E00-\u9FA5]|[\uf900-\ufa2d]/g) != -1) {
        alert("关键词不能为空或者汉字！");
        return;
    }

    let startYearStr = $("#startYear").val().trim();
    let endYearStr = $("#endYear").val().trim();
    if ((startYearStr.length > 0 && parseInt(startYearStr) <= 0)
        || (endYearStr.length > 0 && parseInt(endYearStr) <= 0)) {
        alert("年份必须大于0！");
        return;
    }
    if (startYearStr.length > 0 
        && endYearStr.length > 0 
        && parseInt(startYearStr) > parseInt(endYearStr)) {
        alert("开始年份必须小于等于结束年份！");
        return;
    }

    // init
    $("#tips").html($("#loading-tips-info-template").html());
    $("#result").empty();

    let firstHit = 0;
    let pageSize = 1000;
    let total = 0;
    let paperList = [];
    let filter = {
        category: $("#category").val(),
        rank: $("#rank").val(),
        venue: $("#venue").val(),
        year: {
            start: startYearStr,
            end: endYearStr
        }
    };

    doSearch(query, firstHit, pageSize, total, paperList, filter);
}

function queryAbstract(paperDOI, paperTitle = null, abstractSelector) {
    // read cache if exists
    let abstractTag = $(abstractSelector);
    if (abstractTag.html()) {
        if (abstractTag.css("display") == "block") {
            abstractTag.css("display", "none");
        } else {
            abstractTag.css("display", "block");
        }
        return;
    }

    // init
    let loadingTips = $(abstractSelector + "tips");
    loadingTips.html($("#loading-tips-info-template").html());
    let errorMsg = "没找到摘要=_=";

    // query
    if (!paperDOI) {
        doQueryAbstract(
            false,
            paperDOI,
            paperTitle,
            abstractTag,
            loadingTips,
            errorMsg
        );
    } else {
        doQueryAbstract(
            true,
            paperDOI,
            paperTitle,
            abstractTag,
            loadingTips,
            errorMsg
        );
    }
}

function doQueryAbstract(
    isDOIQuery = true,
    paperDOI,
    paperTitle,
    abstractTag,
    loadingTips,
    errorMsg
) {
    let semanticScholarUrl = "https://api.semanticscholar.org/graph/v1/paper/";
    let inputData = {
        fields: "title,abstract",
    };

    if (isDOIQuery) {
        semanticScholarUrl += "DOI:" + paperDOI;
    } else {
        semanticScholarUrl += "search";
        inputData["query"] = paperTitle;
        inputData["limit"] = 1;
        inputData["fieldsOfStudy"] = "Computer Science";
    }

    // $.ajaxSettings.async = false;
    $.getJSON(semanticScholarUrl, inputData, function (data) {        
        let abstract;
        if (isDOIQuery) {
            if (!data["abstract"]) {
                // search by title
                doQueryAbstract(
                    false,
                    paperDOI,
                    paperTitle,
                    abstractTag,
                    loadingTips,
                    errorMsg
                );
                return;
            }
            abstract = data["abstract"];
        } else {
            if (data["total"] == 0 || !data["data"][0]["abstract"]) {
                abstractTag.html(errorMsg);
                loadingTips.empty();
                return;
            }

            let paper = data["data"][0];
            abstract = paper["abstract"];
        }

        abstractTag.html(abstract);
        loadingTips.empty();
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        alert("请求失败，请重新尝试！");
        loadingTips.empty();
    });
}
