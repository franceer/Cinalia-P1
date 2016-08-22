module.exports.getPaginationData = function (rowCount, pageSize, paginationLimit, currentPage) {
    var totalPages = Math.ceil(rowCount / (pageSize ? pageSize : 20));
    var pageGroups = Math.ceil(totalPages / (paginationLimit ? paginationLimit : 10));
    items = [];
    var lastPage = totalPages;
    var next = currentPage < lastPage ? currentPage + 1 : 1;
    var prev = currentPage < 2 ? lastPage : currentPage - 1;
    var isFirstPage = currentPage === 1;
    var isLastPage = currentPage === lastPage;
    var highestF = currentPage + 2;
    var lowestF = currentPage - 2;
    var counterLimit = totalPages - 2;

    if (pageGroups > 1) {
        items.push(1);
        items.push(2);
        // if our current page is higher than 3
        if (lowestF > 3) {
            items.push('...');
            //lets check if we our current page is towards the end
            if (lastPage - currentPage < 2) {
                lowestF -= 3; // add more previous links       
            }
        }
        else {
            lowestF = 3; // lowest num to start looping from
        }
        for (var counter = lowestF; counter < lowestF + 5; counter++) {
            if (counter > counterLimit) {
                break;
            }
            items.push(counter);
        }
        // if current page not towards the end
        if (highestF < totalPages - 2) {
            items.push('...');
        }
        items.push(lastPage - 1);
        items.push(lastPage);
    }
    else {
        // no complex pagination required
        for (var counter2 = 1; counter2 <= lastPage; counter2++) {
            items.push(counter2);
        }
    }
    return {
        items: items,
        currentPage: currentPage,
        isFirstPage: isFirstPage,
        isLastPage: isLastPage,
        next: next,
        prev: prev,
        total: rowCount,
        limit: pageSize
    };     
};

module.exports.toURLFormat = function (string) {
    var chars = { "à": "a", "á": "a", "â": "a", "ã": "a", "ä": "a", "å": "a", "ò": "o", "ó": "o", "ô": "o", "õ": "o", "ö": "o", "ø": "o", "è": "e", "é": "e", "ê": "e", "ë": "e", "ç": "c", "ì": "i", "í": "i", "î": "i", "ï": "i", "ù": "u", "ú": "u", "û": "u", "ü": "u", "ÿ": "y", "ñ": "n", "-": "_" };
    return string.replace(/[^A-Za-z0-9]/g, function (x) { return chars[x] || x; }).replace(/\s+/g, '_').toLowerCase();
};