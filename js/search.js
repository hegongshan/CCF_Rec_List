function doQueryPaper(query, firstHit, pageSize, total, paperList, condition, searchSuccessHandler, searchFailHandler) {
    const dblpPublUrl = "https://dblp.org/search/publ/api?callback=?";
    let inputData = {
        q: query,
        c: 0,
        f: firstHit,
        h: pageSize,
        format: "jsonp",
    };
    $.getJSON(dblpPublUrl, inputData, function (data) {
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
                let key = paper["key"];
                let slashIdx = key.lastIndexOf("/");
                let venueDBLPURL = key.substr(0, slashIdx);

                // Ignore some irrelevant information
                if (
                    paper.title &&
                    paper.title.match(/[p|P]roceeding|[w|W]orkshop|[c|C]onference/g)
                ) {
                    continue;
                }

                // Whether the key or venue hits or not
                let matchCCFList = CCF_LIST.hasOwnProperty(venueDBLPURL);

                if (condition.categoryList.length > 0
                    || condition.rankList.length > 0
                    || condition.venueList.length > 0) {
                    if (!matchCCFList) {
                        continue;
                    }

                    // 根据分类过滤   
                    if (!isCategoryMatch(venueDBLPURL, condition.categoryList)) {
                        continue;
                    }

                    // 根据级别过滤
                    if (!isRankMatch(venueDBLPURL, condition.rankList)) {
                        continue;
                    }

                    // 根据刊物过滤
                    if (!isVenueMatch(venueDBLPURL, condition.venueList)) {
                        continue;
                    }
                }

                // 根据刊物类别过滤
                if (!isTypeMatch(venueDBLPURL, condition.typeList)) {
                    continue;
                }

                // 根据年份过滤
                if (!isYearRange(year, condition.year.start, condition.year.end)) {
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

                // 一篇论文可能会同时出现在正式刊物和arXiv上，加上venueName，可以避免Id重复
                let id = (title + venueName).replace(/[^a-zA-Z]+(.)/g, function (match, group1) {
                    return group1.toUpperCase();
                });
                id = id.charAt(0).toLowerCase() + id.slice(1);

                paperList.push({
                    ccfRank: ccfRank,
                    key: key,
                    title: title,
                    firstAuthor: firstAuthor,
                    venue: venueName,
                    year: paper["year"],
                    url: url,
                    doi: paper["doi"],
                    id: id
                });
            }

            // recursion
            if (firstHit + size < total) {
                doQueryPaper(query, firstHit + pageSize, pageSize, total, paperList, condition, searchSuccessHandler, searchFailHandler);
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
        searchSuccessHandler(paperList);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        // 执行失败回调函数，显示错误信息
        searchFailHandler();
    });
}

function queryPaper(query, condition, searchSuccessHandler, searchFailHandler) {
    let firstHit = 0;
    // DBLP允许的最大值为1000
    let pageSize = 1000;
    let total = 0;
    let paperList = [];

    doQueryPaper(query, firstHit, pageSize, total, paperList, condition, searchSuccessHandler, searchFailHandler);
}

function queryAbstract(paperDOI, paperTitle, queryAbstractSuccessHandler, queryAbstractFailHandler) {
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
                queryAbstract("", paperTitle, queryAbstractCallback, failCallback);
                return;
            }
            abstract = data["abstract"];
        } else {
            if (data["total"] == 0 || !data["data"][0]["abstract"]) {
                abstract = "";
            } else {
                let paper = data["data"][0];
                abstract = paper["abstract"];
            }
        }

        // 执行成功回调函数，填充论文摘要
        queryAbstractSuccessHandler(abstract);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        // 执行失败回调函数，显示错误信息
        queryAbstractFailHandler();
    });
}

function queryBibTex(key, successHandler, failHandler) {
    const dblpBibTexUrl = `https://dblp.uni-trier.de/rec/${key}.bib`

    $.get(dblpBibTexUrl, function (bib) {
        successHandler(bib);
    }).fail(function () {
        failHandler();
    });
}