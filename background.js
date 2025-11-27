chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {

    // 普通 URL 的下载
    if (msg.action === "downloadImage") {
        let url = msg.url;

        // 提取文件名
        let name = url.split("/").pop().split("?")[0] || ("image_" + Date.now());
        let ext = ".jpg";

        // 自动识别 MIME
        try {
            let res = await fetch(url);
            let type = res.headers.get("content-type") || "";
            if (type.includes("png")) ext = ".png";
            if (type.includes("jpeg")) ext = ".jpg";
            if (type.includes("gif")) ext = ".gif";
            if (type.includes("webp")) ext = ".webp";
        } catch (err) {}

        if (!name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            name += ext;
        }

        chrome.downloads.download({
            url: url,
            filename: name,
            saveAs: false
        });

    }

    // base64 / blob 图片下载
    if (msg.action === "downloadBase64") {
        let base64 = msg.data;

        // 自动识别 MIME
        let ext = ".jpg";
        if (base64.includes("image/png")) ext = ".png";
        if (base64.includes("image/webp")) ext = ".webp";
        if (base64.includes("image/gif")) ext = ".gif";

        let name = "image_" + Date.now() + ext;

        chrome.downloads.download({
            url: base64,
            filename: name,
            saveAs: false
        });
    }
});
