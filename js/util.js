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