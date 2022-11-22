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

                if (!CCF_LIST.hasOwnProperty(venueDBLPURL) || 
                    (rank != "A|B|C" && CCF_LIST[venueDBLPURL]["rank"] != rank)) {
                    continue;
                }

                let firstAuthor;
                if (paper.authors.author instanceof Array) {
                    firstAuthor = paper.authors.author[0].text;
                } else {
                    firstAuthor = paper.authors.author.text;
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
                    "ccfRank": CCF_LIST[venueDBLPURL]["rank"],
                    "title": title,
                    "firstAuthor": firstAuthor,
                    "venue": CCF_LIST[venueDBLPURL]["venue"],
                    "year": paper["year"],
                    "url": url,
                    "doi": paper["doi"],
                    "abstractId": title.replace(/[^a-zA-Z]+/g, "_")
                };
            }
        }

        if (firstHit + pageSize >= total) {
            let html = template.render($("#paper-info-template").html(), {
                "paperList": paperList
            });
            $("#result").append(html);
            $("#tips").html("共匹配到"
                + "<strong style='color:red;'>"
                + Object.keys(paperList).length
                + "</strong>"
                + "条记录");
            return;
        }

        // recursion
        search(query, firstHit + pageSize, pageSize, total, paperList, rank);
    });
}

function doSearch() {
    // trim and check whether or not q is null
    let query = $("#q").val().trim();
    if (query == "") {
        return;
    }
    let rank = $("#rank").find("option:selected").val().trim();

    // init
    $("#result").empty();
    $("#tips").html("搜索中...");

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
