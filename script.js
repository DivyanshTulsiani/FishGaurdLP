// document.getElementById('scrollButton').addEventListener('click', function() {
//     let target = document.getElementById('workflow1start');
//     if (target) {
//         target.scrollIntoView({ behavior: 'smooth' });
//     }
// });
 
// Function to get the user ID (hardcoded for now)
function getUserId() {
    return 'user_123456789'; // Hardcoded user ID for testing
}

// Function to show notifications to the user
function showNotification(message, type = 'info') {
    const notificationContainer = document.getElementById('notification-container') || document.createElement('div');
    
    if (!document.getElementById('notification-container')) {
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '1000';
        document.body.appendChild(notificationContainer);
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerText = message;
    
    notification.style.padding = '12px 20px';
    notification.style.marginBottom = '10px';
    notification.style.borderRadius = '5px';
    notification.style.fontFamily = 'Arial, sans-serif';
    notification.style.color = 'white';
    notification.style.backgroundColor = type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3';

    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 500);
    }, 3000);
}

// Function to validate URLs
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Function to tag a URL as phishing
async function tagUrl(url, isPhishing = 1) {
    try {
        if (!isValidUrl(url)) {
            showNotification('Invalid URL format. Include http:// or https://', 'error');
            return;
        }

        const userId = getUserId();
        console.log(`[FishGuard] Tagging URL: ${url} for user: ${userId}`);

        const response = await fetch("http://localhost:8000/tag-url", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: url,
                is_phishing: isPhishing,
                user_id: userId,
                source: "landing_page"
            })
        });

        if (!response.ok) {
            throw new Error(`Error tagging URL: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('[FishGuard] URL tagged successfully:', result);
        showNotification('URL tagged as phishing successfully!', 'success');
    } catch (error) {
        console.error('Error in tagUrl function:', error);
        showNotification('Failed to tag URL: ' + error.message, 'error');
    }
}

// Function to untag a URL
async function untagUrl(url) {
    try {
        if (!isValidUrl(url)) {
            showNotification('Invalid URL format. Include http:// or https://', 'error');
            return;
        }

        const userId = getUserId();
        console.log(`[FishGuard] Untagging URL: ${url} for user: ${userId}`);

        const response = await fetch("http://localhost:8000/untag-url", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: url,
                user_id: userId
            })
        });

        if (!response.ok) {
            throw new Error(`Error untagging URL: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('[FishGuard] URL untagged successfully:', result);
        showNotification('URL untagged successfully!', 'success');
    } catch (error) {
        console.error('Error in untagUrl function:', error);
        showNotification('Failed to untag URL: ' + error.message, 'error');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('[FishGuard] Script loaded');

    const urlForm = document.getElementById('url-form');
    const urlInput = document.getElementById('url-input');
    const tagButton = document.getElementById('tag-button');
    const untagButton = document.getElementById('untag-button');

    if (tagButton) {
        tagButton.addEventListener('click', async function(e) {
            e.preventDefault();
            const url = urlInput.value.trim();
            if (!url) {
                showNotification('Please enter a valid URL', 'error');
                return;
            }
            await tagUrl(url);
            urlInput.value = '';
        });
    }

    if (untagButton) {
        untagButton.addEventListener('click', async function(e) {
            e.preventDefault();
            const url = urlInput.value.trim();
            if (!url) {
                showNotification('Please enter a valid URL', 'error');
                return;
            }
            await untagUrl(url);
            urlInput.value = '';
        });
    }
});
