//v2018-1
var colour = 'yellow';


// reload the page to reset all markings and DIV displays
function resetall()
{
	window.location.reload(true);

}
function msieversion()
{
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");

	if (msie > 0) // If Internet Explorer, return version number
		return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
	else // If another browser, return 0
		return 0;

}

$(document).ready(function ()
{

	function findall(searchTerm) 
	{
		if (!searchTerm)
		{
			window.alert('Please enter a word or phrase to search for');
			return false;
		}
		if (searchTerm != "*" && searchTerm.length < 2)
		{
			alert("Keyword is too short, try again");
			return false;
		}

		var count = 0;
		clearSearch();
		if(searchTerm != "*")
		{
			var pattern = new RegExp("(" + searchTerm + ")", "igm");
			$(".section").each(function()
			{
				var innerHTML = $(this).html();
				innerHTML = innerHTML.replace(/<\/?span[^>]*>/gi, "");
				$(this).html(innerHTML);
				var result = $(this).find(".result").first().html();
				var link = $(this).find(".sectionLink").first().html();
				if(innerHTML.search(pattern) > 0)
				{
					count = count + 1;
					result = result.replace(pattern, "<span style='background-color:" + colour + "'>$1</span>");
					link = link.replace(pattern, "<span style='background-color:" + colour + "'>$1</span>");
					$(this).find(".result").first().html(result);
					$(this).find(".sectionLink").first().html(link);
					$(this).show();
				}
			});
		} 
		else
		{
			$(".section").show();
			count  = $(".section:visible").length;
		}
		var searchTable = $("#previoussearches");
		searchTable.find("tr:gt(0)").remove();
		$('#previoussearches > tbody:last-child').append('<tr style="background-color:' + colour + ';"><td>' + searchTerm + '</td><td>' + count + '</td>3</tr>');
	}

	$('.details').each(function ()
	{
		showHide($(this));
	});
	function goHome()
	{
		var url = window.location.toString();
		if (url.indexOf("?") >= 0 || url.indexOf("#") >= 0)
			window.location = url.split(/[?#]/)[0];
		else
			window.location = url;
	}
	$("#homeLink, #toplogo").click(function ()
	{
		goHome();
	});
	function showHide(ele)
	{
		var $detail = ele;
		var $link = $detail.prev('a');
		$link.click(function ()
		{
			if ($detail[0].style.display == 'block')
			{
				$detail[0].style.display = "none";
			}
			else
				$detail[0].style.display = "block";

			return false;

		});
	}

	$('.details2').each(function ()
	{
		showHide($(this));
	});

	$('.details').hide();

	$(".details2 > tr > td:nth-child(2):not(.risktable), .result tr td:nth-child(2)").each(function ()
	{
		if ($.trim($(this).text()) == "")
		{
			$(this).parent().remove();
		}
	});

	$(".details2").each(function ()
	{
		if ($(this).find('tr').length == 0)
		{
			$(this).prev('a').remove();
			$(this).remove();
		}
	});
	$(".relationships tr td:nth-child(2)").each(function ()
	{
		if ($.trim($(this).text()) == "")
		{
			$(this).parent().remove();
		}
	});

	$(document).on("click",".termselector",function (event)
	{
		event.preventDefault();
		var href = $(this).attr('href');
		window.history.pushState("new page", "aka", href);
		openItemWithUrl();
		return false;
	});
	$(".treenode").click(function ()
	{
		var id = $(this).attr('name');
		event.preventDefault();
		var href = $(this).attr('href');
		window.history.pushState("new page", "aka", href);
		openItemWithUrl($(this));
        $("html, body").animate({ scrollTop: 0 }, "slow");
		return false;

	});

	$(".alpha").each(function ()
	{
		var $letter = $(this);

		$letter.click(function (event)
		{
			event.preventDefault();
			openByLetter($letter.text());
		});



	});
	function clearSearch()
	{
		$("#previoussearches").find("tr:gt(0)").remove();
		$("#searchTerm").val("");
		$(".section").hide();

	}
	$("#collapseTree").click(function ()
	{
		$(".details").hide();
	});
	$("#expandTree").click(function ()
	{
		$(".details").show();
	});
	var seen = {};
	$('#alphaTable tr').each(function ()
	{
		var txt = $(this).text();
		if (seen[txt])
			$(this).remove();
		else
			seen[txt] = true;
	});

	$("#clearSearch").click(function () { clearSearch(); });

	$("#search").click(function (event)
	{
		event.preventDefault();
		openSearch();
	});
	$("#btnSearch").click(function ()
	{
		findall($("#searchTerm").val());
	});
	$("#searchTerm").keypress(function (e)
	{
		if (e.keyCode == 13)
		{
			findall($("#searchTerm").val());
		}
	});
	function openItemWithUrl(selectedNode)
	{
		var itemtype = GetQueryStringParams("itemtype");
		var itemid = GetQueryStringParams("itemid");
		var alpha = GetQueryStringParams("alpha");
		var action = GetQueryStringParams("action");
		if (itemtype && itemid)
		{
			$(".singleTerm").hide();
			$("#home").hide();
			$("#alphaTable").hide();
			$("#searchForm").hide();
			$("#searchTerm").text("");
			$("#previoussearches").hide();
			$("#found").hide();
			$("#noresult").hide();
			clearSearch();
			$("div[item-type='" + itemtype + "'][item-id='" + itemid + "']").fadeIn();
			$("a").removeClass("highlight");

			if (selectedNode)
			{
				if ($('#selectOption').prop('checked'))
				{
					$('.tree').find('li').each(function ()
					{
						var h = $("a", this).attr("name");
						if (itemtype.toUpperCase() + itemid === h.toUpperCase())
						{
							$("a", this).first().addClass("highlight");
							findChildNode($(this));
						}
					});
				}
				else
				{
					selectedNode.addClass("highlight");
				}
			}
			else
			{
				var highlighted = false;
				$('.tree').find('li').each(function ()
				{
					var h = $("a", this).attr("name");
					if (itemtype.toUpperCase() + itemid === h.toUpperCase())
					{
						if (highlighted == false)
						{
							$("a", this).first().addClass("highlight");
							highlighted = true;
						}
						if ($('#selectOption').prop('checked'))
						{
							$("a", this).first().addClass("highlight");
						}
						findChildNode($(this));
					}
				});
			}
			var url = window.location.toString();
			url = url.split(/[?#]/)[0] + "?itemtype=" + itemtype + "&itemid=" + itemid;
			window.history.pushState("new page", "aka", url);
		}
		else if (alpha)
		{
			openByLetter(alpha.toUpperCase());
		}
		else if (action == 'search')
		{
			openSearch();
		}
		return false;
	}

	function findChildNode(node)
	{
		if (node.closest(".details").length > 0)
		{
			node.closest(".details").show();
			findChildNode(node.closest(".details").parent());
		}
	}

	function openByLetter(letter)
	{
		$("#alphaTable").show();
		$(".singleTerm").hide();
		$("#home").hide();
		$(".letter").hide();
		var rowName = '.' + letter;
		$("#noresult").hide();
		$("#searchForm").hide();
		$("#searchTerm").text("");
		$("#previoussearches").hide();
		$(rowName).parent().show();
		clearSearch();
		//var href= $(this).attr('href');
		var url = window.location.toString();
		url = url.split(/[?#]/)[0] + "?alpha=" + letter;
		window.history.pushState("new page", "aka", url);
		return false;
	}
	function openSearch()
	{
		$("#home").hide();
		$("#searchForm").show();
		$("#previoussearches").show();
		$(".singleTerm").hide();
		$("#alphaTable").hide();
		$("#found").hide();
		clearSearch();
		var url = window.location.toString();
		url = url.split(/[?#]/)[0] + "?action=search";
		window.history.pushState("new page", "aka", url);
		return false;
	}
	function GetQueryStringParams(sParam)
	{
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++)
		{
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam)
			{
				return sParameterName[1];
			}
		}
	}
	window.onpopstate = openItemWithUrl;
	openItemWithUrl();
});


