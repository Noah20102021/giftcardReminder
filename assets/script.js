

const currencyMap = {
    eur: "€",
    usd: "$",
    gbp: "£",
    jpy: "¥",
    cny: "¥",
    krw: "₩",
    inr: "₹",
    rub: "₽",
    chf: "CHF",
    sek: "kr",
    nok: "kr",
    dkk: "kr",
    pln: "zł",
    czk: "Kč",
    huf: "Ft",
    try: "₺",
    ils: "₪",
    zar: "R",
    brl: "R$",
    mxn: "$",
    cad: "$",
    aud: "$",
    nzd: "$",
    sgd: "$",
    hkd: "$",
    twd: "$",
    thb: "฿",
    php: "₱",
    idr: "Rp",
    myr: "RM",
    vnd: "₫",
    pkr: "₨",
    bdt: "৳",
    lkr: "Rs",
    npr: "₨",
    aed: "د.إ",
    sar: "﷼",
    qar: "﷼",
    kwd: "د.ك",
    bhd: ".د.ب",
    omr: "﷼",
    egp: "£",
    mad: "د.م.",
    ngn: "₦",
    kes: "KSh",
    ghs: "₵",
    ugx: "USh",
    tzs: "TSh",
    ars: "$",
    clp: "$",
    cop: "$",
    pen: "S/",
    uyu: "$",
    bob: "Bs",
    pyg: "₲",
    bgn: "лв",
    ron: "lei",
    hrk: "kn",
    rsd: "дин",
    uah: "₴",
    gel: "₾",
    amd: "֏",
    azn: "₼",
    kzt: "₸",
    uzs: "soʻm",
    afn: "؋",
    irr: "﷼",
    mmk: "Ks",
    lak: "₭",
    khr: "៛",
    mnt: "₮",
    isk: "kr",
    jod: "د.ا",
    lbp: "ل.ل",
    syp: "£",
    tnd: "د.ت",
    lyd: "ل.د",
    sdg: "ج.س.",
    etb: "Br",
    dzd: "د.ج",
    mur: "₨",
    scr: "₨",
    mvr: "Rf",
    xof: "CFA",
    xaf: "CFA",
    xpf: "₣"
};

if (window.location.href.endsWith('index.html')) {
    scanCards().then(cards => {
        loadIndexScreen(cards);
    });

    document.getElementById("add").addEventListener("click", () => {
        window.location.href = 'add.html';
    });
}else if(window.location.href.endsWith('add.html')){
    addCurrencyToForm()
    document.getElementById("addForm").addEventListener("submit", () => {
        addCard(new FormData(document.getElementById("addForm")));
    });
    document.getElementById("addFormExpires").disabled = true;
    document.getElementById("addFormExpires").style.display = "none";
    document.getElementById("expiresOnOff").addEventListener("change", () => {
        document.getElementById("addFormExpires").disabled = !document.getElementById("expiresOnOff").checked;
        document.getElementById("addFormExpires").style.display = document.getElementById("expiresOnOff").checked ? "block" : "none";
    })
}

function addCurrencyToForm() {
    const currencySelect = document.getElementById("currencySelect");

    for (var i in currencyMap){
        currencySelect.innerHTML += "<option value='"+i+"'>"+i.toUpperCase()+"("+currencyMap[i]+")"+"</option>";
    }

}

function scanCards() {
    return new Promise(resolve => {
        chrome.storage.local.get(["cards"], data => {
            resolve(data.cards || []);
        });
    });
}


function loadIndexScreen(cards){
    cards.sort((a, b) => {
        const nameA = a.siteName.toLowerCase();
        const nameB = b.siteName.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    Array.from(cards).forEach(card => {
        const cardList = document.getElementById("card-list");
        const siteName = card.siteName || "";
        const siteURL  = card.siteURL  || "";
        const value    = card.value   || "";
        const expires  = card.expires  || "";
        const id       = card.id       || "";
        var currency = card.currency  || "";
        currency = currencyMap[currency];

        cardList.innerHTML += "<article class=\"card\">\n" +
            "                    <div class=\"card-content\">\n" +
            "                        <div class=\"card-header\">\n" +
            "                            <h3 class=\"card-title\">"+siteName+" gift card</h3>\n" +
            "                            <span class=\"card-value\">"+value+currency+"</span>\n" +
            "                        </div>\n" +
            "                        <div class=\"card-details\">\n" +
            "                            <p class=\"card-domain\">\n" +
            "                                <i class=\"fas fa-globe\"></i>\n" +
            "                                "+siteURL+"\n" +
            "                            </p>\n" +
            "                            <p class=\"card-expiry\">\n" +
            "                                <i class=\"far fa-calendar-alt\"></i>\n" +
            "                                Expires: "+expires+"\n" +
            "                            </p>\n" +
            "                        </div>\n" +
            "                    </div>\n" +
            "                    <div class=\"card-actions\">\n" +
            "                        <button id=\""+id+"\" class=\"icon-button\" aria-label=\"Delete\">\n" +
            "                            <i class=\"fas fa-trash\"></i>\n" +
            "                        </button>\n" +
            "                    </div>\n" +
            "                </article>"

        document.getElementById(id).addEventListener("click", () => {
            removeCard(id);
        });
    });
}

function extractSiteName(input) {

    const host = input
        .replace(/^https?:\/\//, "")
        .split("/")[0];


    const parts = host.split(".");


    if (parts[0].toLowerCase() === "www") {
        parts.shift();
    }


    while (parts.length > 1) {
        parts.pop();
    }


    let name = parts[0] || "";


    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    return name;
}

function addCard(formData) {
    const domain = formData.get("Domain");
    const value = formData.get("Value");
    var expires;
    const currency = formData.get("currency");

    if (formData.get("expiresOnOff")) {
        expires = formData.get("Expires");
    }else {
        expires = "No expiry";
    }

    const siteName = extractSiteName(domain);

    chrome.storage.local.get(["cards"], data => {
        const cards = data.cards || [];

        cards.push({
            id: Date.now(),
            siteName: siteName,
            siteURL: domain,
            value: value,
            currency: currency,
            expires: expires
        });

        chrome.storage.local.set({ cards: cards });
    });


}

function removeCard(id) {
    chrome.storage.local.get(["cards"], data => {
        chrome.storage.local.set({
            cards: (data.cards || []).filter(card => card.id !== id)
        });
        location.reload();
    });
}
