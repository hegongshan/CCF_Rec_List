function search(query, firstHit, pageSize, total, paperList, rank) {
    let request_url = "https://dblp.uni-trier.de/search/publ/api?callback=?";
    let inputData = {
        "q": query,
        "c": 0,
        "f": firstHit,
        "h": pageSize,
        "format": "jsonp"
    };
    $.getJSON(request_url, inputData, function (data) {
        let result = data["result"];
        if (parseInt(result["status"]["@code"]) != 200) {
            return;
        }

        total = result["hits"]["@total"];
        if (total > 0) {
            let curPaperList = result["hits"]["hit"];
            for (var i = 0; i < curPaperList.length; i++) {
                let paper = curPaperList[i]["info"];
                let slashIdx = paper["key"].lastIndexOf("/");
                let venueDBLPURL = paper["key"].substr(0, slashIdx);
                let venueName = null;
                let venueNameMatchCCFList = false;

                // Ignore some irrelvant information
                if (paper.title &&
                    paper.title.match(/[p|P]roceeding|[w|W]orkshop|[c|C]onference/g)) {
                    continue;
                }

                // Whether the key or venue hits or not
                let venueURLMatchCCFList = CCF_LIST.hasOwnProperty(venueDBLPURL);
                if (paper.venue) {
                    if (paper.venue instanceof Array) {
                        venueName = paper.venue[0].toUpperCase();
                    } else {
                        venueName = paper.venue.toUpperCase();
                    }
                    venueNameMatchCCFList = CCF_VENUE_RANK_LIST.has(venueName);
                }
                let matchCCFList = venueURLMatchCCFList || venueNameMatchCCFList;
                if (!matchCCFList) {
                    continue;
                }

                // Whether the rank match CCF Rank or not
                let matchFiltering = (rank == "A|B|C" ||
                    (venueURLMatchCCFList && CCF_LIST[venueDBLPURL]["rank"] == rank) ||
                    (venueNameMatchCCFList && CCF_VENUE_RANK_LIST[venueName] == rank));
                if (!matchFiltering) {
                    continue;
                }

                let ccfRank;
                if (venueURLMatchCCFList) {
                    ccfRank = CCF_LIST[venueDBLPURL]["rank"];
                    venueName = CCF_LIST[venueDBLPURL]["venue"];
                } else {
                    ccfRank = CCF_VENUE_RANK_LIST[venueName];
                }

                let firstAuthor = '';
                if (paper.authors) {
                    if (paper.authors.author instanceof Array) {
                        firstAuthor = paper.authors.author[0].text;
                    } else {
                        firstAuthor = paper.authors.author.text;
                    }
                }
                let title = paper["title"].replace(/['"\.]+/g, "");
                let url;
                if (paper["ee"]) {
                    url = paper["ee"];
                } else {
                    // not available
                    url = "javascript:void(0)";
                }

                paperList[title] = {
                    "ccfRank": ccfRank,
                    "title": title,
                    "firstAuthor": firstAuthor,
                    "venue": venueName,
                    "year": paper["year"],
                    "url": url,
                    "doi": paper["doi"],
                    "abstractId": title.replace(/[^a-zA-Z]+/g, "_")
                };
            }
        }

        if (firstHit + pageSize >= total) {
            let tips = template.render($("#response-tips-info-template").html(), {
                "count": Object.keys(paperList).length
            });
            $("#tips").html(tips);

            let html = template.render($("#paper-info-template").html(), {
                "paperList": paperList
            });
            $("#result").append(html);
            return;
        }

        // recursion
        search(query, firstHit + pageSize, pageSize, total, paperList, rank);
    });
}

function doSearch() {
    // trim q
    let query = $("#q").val().trim();
    // 1.check whether q is null or not 
    // 2.ensure that string q is not a chinese character sequence
    if (query == "" || query.search(/[\u4E00-\u9FA5]|[\uf900-\ufa2d]/g) != -1) {
        return;
    }
    let rank = $("#rank").find("option:selected").val().trim();

    // init
    $("#result").empty();
    $("#tips").html($("#loading-tips-info-template").html());

    let firstHit = 0;
    let pageSize = 1000;
    let total = 0;
    let paperList = {};
    search(query, firstHit, pageSize, total, paperList, rank);
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

    let semanticScholarUrl = "https://api.semanticscholar.org/graph/v1/paper/";
    let inputData = {
        "fields": "title,abstract"
    };

    let isQuery = false;
    if (paperDOI) {
        semanticScholarUrl += "DOI:" + paperDOI;
    } else {
        semanticScholarUrl += "search";
        inputData["query"] = paperTitle;
        inputData["limit"] = 1;
        inputData["fieldsOfStudy"] = "Computer Science";
        isQuery = true;
    }

    let loadingTips = $(abstractSelector + "tips")
    loadingTips.html("加载中...");
    // $.ajaxSettings.async = false;
    $.getJSON(semanticScholarUrl, inputData, function (data) {
        let abstract;
        if (isQuery) {
            if (data["total"] == 0) {
                return;
            }

            let paper = data["data"][0];
            // maybe
            abstract = paper["abstract"];
            console.log(paper["title"],
                paper["title"].toLowerCase().replace(/[^a-zA-Z]+/g, "_") ==
                abstractSelector.toLowerCase().replace("#", ""));
        } else {
            if (!data["abstract"]) {
                return;
            }
            abstract = data["abstract"];
        }
        abstractTag.html(abstract);
        loadingTips.empty();
    });
}
