document.addEventListener("click", async function (e) {
    if (!e.altKey) return;
    if (e.button !== 0) return;

    let img = e.target;

    if (img.tagName === "IMG") {
        let src = img.src;

        // blob 图片处理
        if (src.startsWith("blob:")) {
            let blob = await fetch(src).then(r => r.blob());
            let reader = new FileReader();

            reader.onloadend = function () {
                chrome.runtime.sendMessage({
                    action: "downloadBase64",
                    data: reader.result
                });
            };

            reader.readAsDataURL(blob);

        } else {
            // 普通 URL
            chrome.runtime.sendMessage({
                action: "downloadImage",
                url: src
            });
        }

        e.preventDefault();
        e.stopPropagation();
    }
});
