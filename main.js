var fileExplorer = (function() {

    var generateDirectoryMarkup = function(jsonStructure) {
        var structureMarkup = '<ul>';
        jsonStructure.forEach(function (element) {
            if(element.type  === 'folder') {
                structureMarkup += '<li class="folder"><span>' + element.name + '</span>';
                structureMarkup += generateDirectoryMarkup(element.contents) + '</li>';
            }
            else {
                structureMarkup += '<li class="file"><span>' + element.name + '</span></li>';
            }
        });
        structureMarkup += '</ul>';
        return structureMarkup;
    }

    var showNextLevel = function (e) {
        var $target = $(e.target);
        if($target.hasClass('file')) return;
        $target.siblings('li').removeClass('active');
        $target.removeClass('active').addClass('active-tree');
        var x = $target.children('ul').children('li');
        if(x.length > 0) {
            x.addClass('active');
        }
        else {
            $('.no-file-window').show();
        }
    }

    var showPreviousLevel = function (e) {
        e.preventDefault();
        $('.no-file-window').hide();
        var $activateTree = $('.active-tree');
        if($activateTree.length > 0) {
            var $deepestOpenTree = $activateTree.eq($activateTree.length-1);
            $deepestOpenTree.find('ul > li').removeClass('active');
            $deepestOpenTree.removeClass('active-tree').addClass('active').siblings('li').addClass('active');
        }
    }

    var initializeFolders = function (response) {
        var $fileWindowDOMRef = $('.file-window').eq(0);
        var rootStructure = response.root;
        var finalMarkup = generateDirectoryMarkup(rootStructure);
        $fileWindowDOMRef.html(finalMarkup);
        $fileWindowDOMRef.find('> ul > li').addClass('active');
        $('body').on('click', 'li.folder', showNextLevel);
        $('.back-btn').on('click', showPreviousLevel);
    }

    var init = function() {
        var getFolderStructure = $.ajax('./assets/json/folderStructure.json');
        getFolderStructure.done(initializeFolders);
    }

    return {
        init: init
    }

})();

$(document).ready(() => {
    fileExplorer.init();
})