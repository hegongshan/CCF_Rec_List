/* 
 * -----------------------------------------------------------------------------
 *                                  全局变量
 * -----------------------------------------------------------------------------
 */
// 分页变量
let pagination = {
    paperList: [],
    pageList: [],
    pageSize: 10,
    pageSizeStr: "10",
    navigatePages: 10
};

/* 
 * -----------------------------------------------------------------------------
 *                                  自定义函数
 * -----------------------------------------------------------------------------
 */
function failHandler($loadingTips) {
    let alertHtml = template.render($("#alertTemplate").html(), {
        title: "提示信息",
        message: "请求失败，请重新尝试！"
    });
    $("#alert").html(alertHtml);
    $('#alert').modal();
}

function updateVenue(currentSelector, previousVals, selectpickerExtendedOptions) {
    let categoryVals = $("#category").val();
    let typeVals = $("#type").val();
    let rankVals = $("#rank").val();
    let $venue = $("#venue");

    // 如果三者均没有值，则禁用venue
    if (categoryVals.length == 0 && typeVals.length == 0 && rankVals.length == 0) {
        // 清空venue的值，避免影响搜索结果
        if ($venue.val().length > 0) {
            $venue.selectpicker("deselectAll");
        }
        $venue.prop("disabled", true);
        $venue.selectpicker("destroy");
        $venue.selectpicker(selectpickerExtendedOptions);
        return;
    }

    // 如果该元素当前和之前均没有值，则无需更新venue
    if ($(currentSelector).val().length == 0 && previousVals[currentSelector].length == 0) {
        return;
    }

    // 更新上一次选中的值
    previousVals[currentSelector] = $(currentSelector).val();

    // 清空列表
    $venue.prop("disabled", false);
    $venue.empty();

    // 重新填充列表
    let venueList = [];
    let categoryList = {};
    if (categoryVals.length == 0) {
        categoryList = CATEGORY_LIST;
    } else {
        // 将选择的分类转换为JSON对象
        categoryVals.forEach(function (element, index) {
            categoryList[element] = "";
        });
    }
    // 根据分类过滤
    for (let category in categoryList) {
        for (let venueDBLPUrl in CATEGORY_LIST[category]) {
            // 根据类型过滤
            if (!isTypeMatch(venueDBLPUrl, typeVals)) {
                continue;
            }

            // 根据级别过滤
            if (!isRankMatch(venueDBLPUrl, rankVals)) {
                continue;
            }

            venueList.push({
                url: venueDBLPUrl,
                name: CATEGORY_LIST[category][venueDBLPUrl].venue,
                fullname: CATEGORY_LIST[category][venueDBLPUrl].fullname,
                type: venueDBLPUrl.startsWith("journals") ? "期刊" : "会议",
                rank: CATEGORY_LIST[category][venueDBLPUrl].rank
            });
        }
    }

    let venueHtml = template.render($("#venueTemplate").html(), {
        venueList: venueList
    });
    $venue.html(venueHtml);
    $venue.selectpicker("destroy");
    $venue.selectpicker(selectpickerExtendedOptions);
}

function updatePaperList(currentPageStr = '1') {
    // 如果没有匹配的论文，则直接返回
    if (pagination.paperList.length == 0) {
        return;
    }

    // currentPage从1开始，其索引为currentPage - 1
    let currentPage = parseInt(currentPageStr);

    // 显示全部的论文
    if (pagination.pageSizeStr == "All") {
        pagination.pageSize = pagination.paperList.length;
    } else {
        pagination.pageSize = parseInt(pagination.pageSizeStr);
    }

    // 计算总页数和页列表
    let totalPage = Math.floor((pagination.paperList.length + pagination.pageSize - 1) / pagination.pageSize);
    pagination.pageList = Array.from({ length: totalPage }, (_, index) => index + 1);

    // 计算开始论文索引和结束论文索引
    let startPaperIndex = (currentPage - 1) * pagination.pageSize;
    let endPaperIndex = Math.min(currentPage * pagination.pageSize, pagination.paperList.length);

    // 计算开始页码和结束页码
    let startPageIndex;
    if (currentPage % pagination.navigatePages == 0) {
        startPageIndex = parseInt((currentPage - 1) / pagination.navigatePages) * pagination.navigatePages;
    } else {
        startPageIndex = Math.floor((currentPage - 1) / pagination.navigatePages) * pagination.navigatePages;
    }
    let endPageIndex = Math.min(startPageIndex + pagination.navigatePages, pagination.pageList.length);

    // 渲染分页代码
    let paperHtml = template.render($("#paperTemplate").html(), {
        paperList: pagination.paperList.slice(startPaperIndex, endPaperIndex),
        startPaperNumber: startPaperIndex + 1,

        pageInfo: {
            firstPage: 1,
            lastPage: totalPage,
            pageList: pagination.pageList.slice(startPageIndex, endPageIndex),

            previousPage: currentPage - 1,
            currentPage: currentPage,
            nextPage: currentPage + 1,

            pageSizeList: ["10", "20", "50", "100", "All"],
            pageSizeStr: pagination.pageSizeStr // 处理All
        }
    });
    $("#result").html(paperHtml);

    // 回到页面顶部
    $("html, body").animate({ scrollTop: 0 }, 0);
}

function fillPaperList() {
    // 重置pageSize，避免影响不同查询
    pagination.pageSizeStr = "10";

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

    let condition = {
        categoryList: $("#category").val(),
        typeList: $("#type").val(),
        rankList: $("#rank").val(),
        venueList: $("#venue").val(),
        year: {
            start: startYearStr,
            end: endYearStr
        }
    };

    // 显示加载图片，并清空查询结果
    let $loadingTips = $("#tips");
    $loadingTips.html($("#loadingTipsTemplate").html());
    $("#result").empty();

    // 搜索并更新论文列表
    queryPaper(
        query,
        condition,
        function (paperList) {
            pagination.paperList = paperList;

            let tips = template.render($("#responseTipsTemplate").html(), {
                count: pagination.paperList.length,
            });
            $("#tips").html(tips);
            
            updatePaperList();
        },
        function () {
            failHandler();
            $loadingTips.empty();
        }
    );
}

function fillAbstractHandler($abstractTag, $loadingTips, abstract) {
    if (isEmpty(abstract)) {
        abstract = "没有找到摘要=_=";
    }

    // 填充摘要
    $abstractTag.html(abstract);
}

function fillAbstract(paperDOI, paperTitle = null, abstractSelector) {
    displayBlockToNone(abstractSelector + "BibTex");

    let $abstractTag = $(abstractSelector);

    // 读取缓存
    if ($abstractTag.html()) {
        $abstractTag.toggle();
        return;
    }

    // init
    let $loadingTips = $(abstractSelector + "Tips");
    $loadingTips.html($("#loadingTipsTemplate").html());

    // 查询摘要
    queryAbstract(paperDOI, paperTitle, function (abstract) {
        fillAbstractHandler($abstractTag, $loadingTips, abstract);
        $loadingTips.empty();
    }, function () {
        failHandler();
        $loadingTips.empty();
    });
}

function getBibTex(key, abstractSelector, tipSelector, bibTexSelector) {
    displayBlockToNone(abstractSelector);

    if ($(bibTexSelector).text()) {
        $(bibTexSelector).toggle();
        return;
    }

    let $loadingTips = $(tipSelector);
    $loadingTips.html($("#loadingTipsTemplate").html());

    queryBibTex(key, function (bib) {
        $(bibTexSelector).text(bib.trim());
        $loadingTips.empty();
    }, function () {
        failHandler();
        $loadingTips.empty();
    });
}

$(function () {
    // 版权信息
    let footerHtml = template.render($("#copyrightTemplate").html(), {
        year: {
            start: 2022,
            current: new Date().getFullYear()
        },
    });
    $("#copyright").html(footerHtml);

    let $category = $("#category");
    let $type = $("#type");
    let $rank = $("#rank");
    let $venue = $("#venue");

    // 填充分类
    let categoryList = [];
    for (let venueDBLPUrl in CATEGORY_LIST) {
        categoryList.push({ "name": venueDBLPUrl });
    }
    let categoryHtml = template.render($("#categoryTemplate").html(), {
        categoryList: categoryList,
    });
    $category.html(categoryHtml);

    // bootstrap-select初始化
    let selectpickerOptions = {
        actionsBox: true,
        selectAllText: "全选",
        deselectAllText: "取消全选",
        noneResultsText: "未找到匹配的结果"
    };
    let selectpickerExtendedOptions = Object.assign({}, selectpickerOptions, {
        liveSearch: true,
        selectedTextFormat: "count > 3",
        countSelectedText: "选择了{0}项"
    });
    $category.selectpicker(selectpickerExtendedOptions);
    $type.selectpicker(selectpickerOptions);
    $rank.selectpicker(selectpickerOptions);
    $venue.prop("disabled", true);
    $venue.selectpicker(selectpickerExtendedOptions);

    var previousVals = {
        "#category": [],
        "#type": [],
        "#rank": []
    };
    $category.on("hidden.bs.select", function () {
        updateVenue("#category", previousVals, selectpickerExtendedOptions);
    });
    $type.on("hidden.bs.select", function () {
        updateVenue("#type", previousVals, selectpickerExtendedOptions);
    });
    $rank.on("hidden.bs.select", function () {
        updateVenue("#rank", previousVals, selectpickerExtendedOptions);
    });

    // 主题切换
    $("#themeLight").click(function () {
        $("body").removeClass("dark-theme");
    });
    $("#themeDark").click(function () {
        $("body").addClass("dark-theme");
    });

    // 添加和删除新关键词
    $("#addKeyword").click(function () {
        $(".custom-switch").before($("#keywordTemplate").html());
    });
    $("body").on("click", ".remove-keyword", function () {
        $(this).parent().parent().remove();
    });

    // 搜索
    $("#search").click(function () {
        fillPaperList();
    });
    $("body").on("keydown", ".q", function (event) {
        if (event.keyCode == 13) {
            fillPaperList();
        }
    });

    // 选择pageSize
    $("body").on("change", "#pageSizeSelect", function () {
        let oldPageSize = pagination.pageSize;

        pagination.pageSizeStr = $(this).val();

        // 避免不必要的页面更新操作
        if (pagination.paperList.length <= oldPageSize
            && (pagination.pageSizeStr == "All"
                || pagination.paperList.length <= parseInt(pagination.pageSizeStr))) {
            return;
        }

        updatePaperList();
    });

    // 常见问题
    $("#faq").click(function () {
        let faqHtml = template.render($("#alertTemplate").html(), {
            title: "常见问题",
            message: $("#faqTemplate").html()
        });
        let $alert = $("#alert");
        $alert.html(faqHtml);
        $alert.modal();
    });

    // 回到顶部
    let $backToTopBtn = $("#backToTopBtn");
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $backToTopBtn.fadeIn();
        } else {
            $backToTopBtn.fadeOut();
        }
    });
    $backToTopBtn.click(function () {
        $("html, body").animate({ scrollTop: 0 }, 300);
    });

    // 不要在移动端展示提示框
    if (!isMobileDevice()) {
        $backToTopBtn.tooltip({ trigger: "hover" });

        // 为venue设置title属性
        $("body").on("mouseenter", "li:has(.abbr)", function () {
            let $li = $(this);

            // 避免重复设置title
            if ($li.attr("title")) {
                return;
            }

            let fullname = $li.find(".abbr").next().text().trim();
            if (isEmpty(fullname)) {
                return;
            }

            $li.attr("title", fullname);
        });
    }
});