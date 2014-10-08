define(["jquery"], function($) {
    var notificationImage = $("#notificationImage"),
        iconUrl = notificationImage.attr("src"),
        notificationId = "office365_checker_notification",
        oldNotificationCount = 0;

    chrome.notifications.onClicked.addListener(function() {
        chrome.browserAction.onClicked.dispatch();  //do the same thing as clicking on the badge when clicking the notification
    });

    function updateNotification(unreadCount, notificationOptions) {
        if(unreadCount === 0) {
            chrome.notifications.clear(notificationId, $.noop);
        } else if(unreadCount > oldNotificationCount) {
            chrome.notifications.clear(notificationId, $.noop);
            chrome.notifications.create(notificationId, notificationOptions, $.noop);
        } else {
            chrome.notifications.update(notificationId, notificationOptions, $.noop);
        }

        oldNotificationCount = unreadCount;
    }

    return {
        notify: function(unreadCount, unreadMessages) {
            var notificationOptions = {};

            if(typeof unreadCount !== "number" || isNaN(unreadCount)) {
                unreadCount = 0;
            }

            if(typeof unreadMessages === 'undefined') {
                notificationOptions = {
                    type: "basic",
                    title: "New Office365 Mail",
                    message: "You have " + unreadCount + " unread messages",
                    iconUrl: iconUrl
                };
            } else {
                notificationOptions = {
                    type: "list",
                    title: unreadCount + " new messages",
                    message: "You have " + unreadCount + " unread messages",
                    iconUrl: iconUrl,
                    items: $.map(unreadMessages, function(msg, i) {
                        return { title: msg.sender, message: msg.subject };
                    })
                };
            }

            updateNotification(unreadCount, notificationOptions);
        }
    };
});
