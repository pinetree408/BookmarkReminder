// Traverse the bookmark tree, and print the folder and nodes.
function dumpBookmarks(query) {
  var bookmarkTreeNodes = chrome.bookmarks.getTree(
    function(bookmarkTreeNodes) {
      $('#bookmarks').append(dumpTreeNodes(bookmarkTreeNodes, query));
    });
}

function dumpTreeNodes(bookmarkNodes, query) {
  var list = $('<ul>');
  var i;
  for (i = 0; i < bookmarkNodes.length; i++) {
    list.append(dumpNode(bookmarkNodes[i], query));
  }
  return list;
}

function dumpNode(bookmarkNode, query) {
  if (bookmarkNode.title) {
    if (query && !bookmarkNode.children) {
      if (String(bookmarkNode.title).indexOf(query) == -1) {
        return $('<span></span>');
      }
    }
    var anchor = $('<a>');
    anchor.attr('href', bookmarkNode.url);
    anchor.text(bookmarkNode.title);
    /*
     * When clicking on a bookmark in the extension, a new tab is fired with
     * the bookmark url.
     */
    anchor.click(function() {
      chrome.storage.local.get(bookmarkNode.title, function(result) {
        if (result[bookmarkNode.title] != undefined) {
	  var obj = {};
	  obj[bookmarkNode.title] = result[bookmarkNode.title] + 1;
          chrome.storage.local.set(obj);
	}
      });
      chrome.tabs.create({url: bookmarkNode.url});
    });
    var span = $('<span>');
    span.append(anchor);
    chrome.storage.local.get(bookmarkNode.title, function(result) {
      if (result[bookmarkNode.title]) {
        span.append(result[bookmarkNode.title]);
      } else {
	var obj = {}
	obj[bookmarkNode.title] = 0
        chrome.storage.local.set(obj);
        span.append(0);
      }
    });
  }
  var li = $(bookmarkNode.title ? '<li>' : '<div>').append(span);
  if (bookmarkNode.children && bookmarkNode.children.length > 0) {
    li.append(dumpTreeNodes(bookmarkNode.children, query));
  }
  return li;
}

document.addEventListener('DOMContentLoaded', function () {
  dumpBookmarks();
});
