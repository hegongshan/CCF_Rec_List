let CCF_LIST = {
    // Storage
    "conf/fast": { "venue": "FAST", "rank": "A" },
    "conf/usenix": { "venue": "USENIX ATC", "rank": "A" },
    "conf/osdi": { "venue": "OSDI", "rank": "A" },
    "conf/sosp": { "venue": "SOSP", "rank": "A" },
    "conf/sc": { "venue": "SC", "rank": "A" },
    "conf/eurosys": { "venue": "EuroSys", "rank": "B" },
    "conf/mss": { "venue": "MSST", "rank": "B" },
    "conf/systor": { "venue": "SYSTOR", "rank": "C" },
    "journals/tos": { "venue": "TOS", "rank": "A" },
    "journals/tpds": { "venue": "TPDS", "rank": "A" },

    // Computer System
    "journals/tocs": { "venue": "TOCS", "rank": "A" },
    "journals/tc": { "venue": "TC", "rank": "A" },
    "journals/tcad": { "venue": "TCAD", "rank": "A" },
    "conf/ppopp": { "venue": "PPoPP", "rank": "A"},
    "conf/dac": { "venue": "DAC", "rank": "A"},
    
    "conf/cloud": { "venue": "SoCC", "rank": "B"},
    "conf/spaa": { "venue": "SPAA", "rank": "B"},
    "conf/podc": { "venue": "PODC", "rank": "B"},
    "conf/fpga": { "venue": "FPGA", "rank": "B"},
    "conf/cgo": { "venue": "CGO", "rank": "B"},
    "conf/date": { "venue": "DATE", "rank": "B"},
    "conf/cluster": { "venue": "CLUSTER", "rank": "B"},
    "conf/iccd": { "venue": "ICCD", "rank": "B"},
    "conf/iccad": { "venue": "ICCAD", "rank": "B"},
    "conf/icdcs": { "venue": "ICDCS", "rank": "B"},
    "conf/codes": { "venue": "CODES+ISSS", "rank": "B"},
    "conf/hipeac": { "venue": "HiPEAC", "rank": "B"},
    "conf/IEEEpact": { "venue": "PACT", "rank": "B"},
    "conf/icpp": { "venue": "ICPP", "rank": "B"},
    "conf/ics": { "venue": "ICS", "rank": "B"},
    "conf/ipps": { "venue": "IPDPS", "rank": "B"},
    "conf/vee": { "venue": "VEE", "rank": "B"},
    "conf/hpdc": { "venue": "HPDC", "rank": "B"},
    "conf/itc": { "venue": "ITC", "rank": "B"},
    "conf/lisa": { "venue": "LISA", "rank": "B"},
    "conf/rtas": { "venue": "RTAS", "rank": "B"},
    
    // performance analysis
    "conf/sigmetrics": { "venue": "SIGMETRICS", "rank": "B"},
    "conf/performance": { "venue": "Performance", "rank": "B"},
    "conf/ispass": { "venue": "ISPASS", "rank": "C"},

    // Database
    "journals/pvldb": { "venue": "VLDB", "rank": "A" },
    "conf/vldb": { "venue": "VLDB Workshop", "rank": "A" },
    "conf/sigmod": { "venue": "SIGMOD", "rank": "A" },
    "conf/icde": { "venue": "ICDE", "rank": "A" },

    // Computer Architecture
    "conf/isca": { "venue": "ISCA", "rank": "A" },
    "conf/micro": { "venue": "MICRO", "rank": "A" },
    "conf/hpca": { "venue": "HPCA", "rank": "A" },
    "conf/asplos": { "venue": "ASPOLS", "rank": "A" },

    // survey
    "journals/csur": { "venue": "CSUR", "rank": "not in recommended list (It's equivalent to Rank A)" }
};

function search(query, firstHit, pageSize, total, matchTotal, html) {
    let request_url = "https://dblp.uni-trier.de/search/publ/api?q=" +
        query + "&format=jsonp&c=0&f=" + firstHit + "&h=" + pageSize + "&callback=?";
    $.getJSON(request_url, function (data) {
        let result = data["result"];
        if (parseInt(result["status"]["@code"]) != 200) {
            return;
        }

        total = result["hits"]["@total"];
        if (total > 0) {
            paperList = result["hits"]["hit"];
            for (var i = 0; i < paperList.length; i++) {
                let paper = paperList[i]["info"];
                let slashIdx = paper["key"].lastIndexOf("/");
                let venue_dblp_url = paper["key"].substr(0, slashIdx);

                if (!CCF_LIST.hasOwnProperty(venue_dblp_url)) {
                    continue;
                }

                let first_author;
                if (paper.authors.author instanceof Array) {
                    first_author = paper.authors.author[0].text;
                } else {
                    first_author = paper.authors.author.text;
                }
                let title = paper["title"];
                let year = parseInt(paper["year"]);
                let url;
                if (paper["ee"]) { 
                    url = paper["ee"];
                } else {
                    // not available
                    url = "javascript:void(0)";
                }
                let venue = CCF_LIST[venue_dblp_url]["venue"];
                let abstractId = title.substr(0, title.length - 1)
                                        .replace(/[^a-zA-Z]+/g, "_");
                let queryFn = "queryAbstract(" 
                    + "'" + paper["doi"] + "'," 
                    + "'" + title + "',"
                    + "'#" + abstractId + "')";
                html += "<li>[CCF " + CCF_LIST[venue_dblp_url]["rank"] + "] "
                    + first_author + ", et al. "
                    + "<strong style='font-weight:bold;'>" + title + "</strong>, "
                    + venue + "'" + year + ", "
                    + "<a href='" + url + "'>URL</a><br/>"
                    + "<a style='text-decoration:underline;font-family:bold;' onclick=\"" + queryFn + "\">Abstract</a><br/>"
                    + "<span id='" + abstractId + "tips'></span>"
                    + "<p id='" + abstractId + "'></p>"
                    + "</li>";
                matchTotal++;
            }
        }

        if (firstHit + pageSize >= total) {
            $("#result").append("<ol>" + html + "</ol>");
            $("#tips").html("共匹配到"
                + "<strong style='color:red;'>"
                + matchTotal
                + "</strong>"
                + "条记录");
            return ;
        }

        // recursion
        search(query, firstHit + pageSize, pageSize, total, matchTotal, html);
    });
}

function doSearch() {
    // trim and check whether q is null or not
    let query = $("#q").val();
    query = $.trim(query);
    if (query == "") {
        return ;
    }
    // init
    $("#result").empty();
    $("#tips").html("搜索中...");

    let firstHit = 0;
    let pageSize = 1000;
    let total = 0;
    let matchTotal = 0;
    let html = "";
    search(query, firstHit, pageSize, total, matchTotal, html);
}

function queryAbstract(paperDOI, paperTitle=null, abstractSelector) {
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
    if (paperDOI != 'undefined') {
        semanticScholarUrl += "DOI:" + paperDOI;
    } else {
        semanticScholarUrl += "search";
        inputData["query"] = paperTitle;
        inputData["limit"] = 1;
        inputData["fieldsOfStudy"] = "Computer Science";
        isQuery = true;
    }

    let loadingTips = $(abstractSelector+"tips")
    loadingTips.html("加载中...");
    // $.ajaxSettings.async = false;
    $.getJSON(semanticScholarUrl, inputData, function(data){
        let abstract;
        if (isQuery) {
            if (data["total"] == 0) {
                return ;
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
