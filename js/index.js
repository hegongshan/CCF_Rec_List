/* 
 * -----------------------------------------------------------------------------
 *                                  全局变/常量
 * -----------------------------------------------------------------------------
 */
// 表单验证
const INVALID_CLASS = "is-invalid";

// 分页相关
const PAGINATION = {
    paperList: [],
    pageList: [],
    pageSize: 10,
    pageSizeStr: "10",
    navigatePages: 10
};
const ALL_PAGE = "All";

// 论文列表相关
const LOADING_SUFFIX = "Tips";
const ABSTRACT_SUFFIX = "Abstract";
const BIBTEX_SUFFIX = "BibTex";

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
    if (PAGINATION.paperList.length == 0) {
        return;
    }

    // currentPage从1开始，其索引为currentPage - 1
    let currentPage = parseInt(currentPageStr);

    // 显示全部的论文
    if (PAGINATION.pageSizeStr == ALL_PAGE) {
        PAGINATION.pageSize = PAGINATION.paperList.length;
    } else {
        PAGINATION.pageSize = parseInt(PAGINATION.pageSizeStr);
    }

    // 计算总页数和页列表
    let totalPage = Math.floor((PAGINATION.paperList.length + PAGINATION.pageSize - 1) / PAGINATION.pageSize);
    PAGINATION.pageList = Array.from({ length: totalPage }, (_, index) => index + 1);

    // 计算开始论文索引和结束论文索引
    let startPaperIndex = (currentPage - 1) * PAGINATION.pageSize;
    let endPaperIndex = Math.min(currentPage * PAGINATION.pageSize, PAGINATION.paperList.length);

    // 计算开始页码和结束页码
    let startPageIndex;
    if (currentPage % PAGINATION.navigatePages == 0) {
        startPageIndex = parseInt((currentPage - 1) / PAGINATION.navigatePages) * PAGINATION.navigatePages;
    } else {
        startPageIndex = Math.floor((currentPage - 1) / PAGINATION.navigatePages) * PAGINATION.navigatePages;
    }
    let endPageIndex = Math.min(startPageIndex + PAGINATION.navigatePages, PAGINATION.pageList.length);

    // 渲染分页代码
    let paperHtml = template.render($("#paperTemplate").html(), {
        paperList: PAGINATION.paperList.slice(startPaperIndex, endPaperIndex),
        startPaperNumber: startPaperIndex + 1,

        pageInfo: {
            firstPage: 1,
            lastPage: totalPage,
            pageList: PAGINATION.pageList.slice(startPageIndex, endPageIndex),

            previousPage: currentPage - 1,
            currentPage: currentPage,
            nextPage: currentPage + 1,

            pageSizeList: ["10", "20", "50", "100", ALL_PAGE],
            pageSizeStr: PAGINATION.pageSizeStr // 处理All
        }
    });
    $("#result").html(paperHtml);

    // 回到页面顶部
    $("html, body").animate({ scrollTop: 0 }, 0);
}

function validateQuery() {
    let queryValid = true;

    // 验证关键词
    let $searchFeedback = $(".search-feedback");
    $(".q").each(function (index) {
        let $input = $(this);

        let query = $input.val().trim();
        let isEmpty = query == "";
        let hasChineseCharacter = query.match(/[\u4E00-\u9FA5]|[\uF900-\uFA2D]/);

        if (isEmpty || hasChineseCharacter) {
            $input.addClass(INVALID_CLASS);

            let errorMsg = isEmpty ? "关键词不能为空！" : "DBLP不支持中文关键词！";
            $feedback = $searchFeedback.eq(index);
            $feedback.text(errorMsg);

            queryValid = false;
        } else {
            $input.removeClass(INVALID_CLASS);
        }
    });

    return queryValid;
}

function validateYear() {
    // 验证起止年份
    let $startYear = $("#startYear");
    let $endYear = $("#endYear");
    let $yearFeedback = $(".year-feedback");

    let startYearStr = $startYear.val().trim();
    let endYearStr = $endYear.val().trim();
    let isStartYearEmpty = isEmpty(startYearStr);
    let isEndYearEmpty = isEmpty(endYearStr);

    function handleYear($year, $feedback) {
        let currentYear = new Date().getFullYear()
        let errorMsg = `年份必须位于 (0, ${currentYear}] 区间内！`;
        let yearStr = $year.val().trim();
        let yearVal = parseInt(yearStr);
        let isYearInvalid = !isEmpty(yearStr) && (yearVal <= 0 || yearVal > currentYear);

        if (isYearInvalid) {
            $year.addClass(INVALID_CLASS);
            $feedback.text(errorMsg);
        } else {
            $year.removeClass(INVALID_CLASS);
            $feedback.empty();
        }

        return isYearInvalid;
    }

    if (!isStartYearEmpty || !isEndYearEmpty) {
        let isStartYearInvalid = handleYear($startYear, $yearFeedback.eq(0));
        let isEndYearInvalid = handleYear($endYear, $yearFeedback.eq(1));
        if (isStartYearInvalid || isEndYearInvalid) {
            return false;
        }

        if (!isStartYearEmpty && !isEndYearEmpty
            && parseInt(startYearStr) > parseInt(endYearStr)) {
            $startYear.addClass(INVALID_CLASS);
            $endYear.addClass(INVALID_CLASS);
            $yearFeedback.eq(0).text("开始年份必须≤结束年份！");

            return false;
        }
    } else {
        $startYear.removeClass(INVALID_CLASS);
        $endYear.removeClass(INVALID_CLASS);
        $yearFeedback.each(function (index) {
            $(this).empty();
        });
    }

    return true;
}

function getQueryString() {
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
    return query;
}

function getPaperList() {
    // 显示加载图片
    let $loadingTips = $("#tips");
    $loadingTips.html($("#loadingTipsTemplate").html());

    // 如果关键词和起止年份存在问题，则提前返回
    let queryValid = validateQuery();
    let yearValid = validateYear();
    if (!queryValid || !yearValid) {
        return;
    }

    // 清空查询结果
    $("#result").empty();

    // 重置pageSize，避免影响不同查询
    PAGINATION.pageSizeStr = "10";

    let query = getQueryString();
    let condition = {
        categoryList: $("#category").val(),
        typeList: $("#type").val(),
        rankList: $("#rank").val(),
        venueList: $("#venue").val(),
        year: {
            start: $("#startYear").val(),
            end: $("#endYear").val()
        }
    };

    // 搜索并更新论文列表
    queryPaper(
        query,
        condition,
        function (paperList) {
            PAGINATION.paperList = paperList;

            let tips = template.render($("#responseTipsTemplate").html(), {
                count: PAGINATION.paperList.length,
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

function getAbstractHandler($abstractTag, abstract) {
    if (isEmpty(abstract)) {
        abstract = "没有找到摘要=_=";
    }

    // 填充摘要
    $abstractTag.html(abstract);
}

function getAbstract(paperDOI, paperTitle = null, paperSelector) {
    displayBlockToNone(paperSelector + BIBTEX_SUFFIX);

    let $abstractTag = $(paperSelector + ABSTRACT_SUFFIX);
    if ($abstractTag.html()) {
        $abstractTag.toggle();
        return;
    }

    // init
    let $loadingTips = $(paperSelector + LOADING_SUFFIX);
    $loadingTips.html($("#loadingTipsTemplate").html());

    // 查询摘要
    queryAbstract(paperDOI, paperTitle, function (abstract) {
        getAbstractHandler($abstractTag, abstract);
        $loadingTips.empty();
    }, function () {
        failHandler();
        $loadingTips.empty();
    });
}

function getBibTex(key, paperSelector) {
    displayBlockToNone(paperSelector + ABSTRACT_SUFFIX);

    let $paperBibTex = $(paperSelector + BIBTEX_SUFFIX);
    if ($paperBibTex.text()) {
        $paperBibTex.toggle();
        return;
    }

    let $loadingTips = $(paperSelector + LOADING_SUFFIX);
    $loadingTips.html($("#loadingTipsTemplate").html());

    queryBibTex(key, function (bib) {
        $paperBibTex.text(bib.trim());
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

    // 添加和删除新关键词，并处理查询字符串
    $("#addKeyword").click(function () {
        $(".custom-switch").before($("#keywordTemplate").html());
    });
    let $queryString = $("#queryString");
    $("body").on("click", ".remove-keyword", function () {
        $(this).parent().parent().remove();

        if (validateQuery()) {
            $queryString.text(getQueryString());
        }
    });
    $("body").on("change", ".condition, .q", function () {
        if (validateQuery()) {
            $queryString.text(getQueryString());
            $queryString.addClass("badge");
        }
    });
    $("#queryStringCheckbox").change(function () {
        $queryString.toggle();
        if (!$queryString.text()) {
            $queryString.removeClass("badge");
        }
    });

    // 验证年份
    $("#startYear, #endYear").change(function () {
        validateYear();
    });

    // 搜索
    $("#search").click(function () {
        getPaperList();
    });
    $("body").on("keydown", ".q", function (event) {
        if (event.keyCode == 13) {
            getPaperList();
        }
    });

    // 选择pageSize
    $("body").on("change", "#pageSizeSelect", function () {
        let oldPageSize = PAGINATION.pageSize;

        PAGINATION.pageSizeStr = $(this).val();

        // 避免不必要的页面更新操作
        if (PAGINATION.paperList.length <= oldPageSize
            && (PAGINATION.pageSizeStr == ALL_PAGE
                || PAGINATION.paperList.length <= parseInt(PAGINATION.pageSizeStr))) {
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