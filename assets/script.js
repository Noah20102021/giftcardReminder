

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

scanCards()

function scanCards() {

    const cardList = document.getElementById("card-list");

    fetch("assets/storage.xml")
        .then(response => response.text())
        .then(xmlText => {

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");

            const cardNodes = xmlDoc.getElementsByTagName("card");

            Array.from(cardNodes).forEach(card => {

                const siteName = card.getElementsByTagName("siteName")[0]?.textContent || "";
                const siteURL  = card.getElementsByTagName("siteURL")[0]?.textContent  || "";
                const value    = card.getElementsByTagName("value")[0]?.textContent    || "";
                const expires  = card.getElementsByTagName("expires")[0]?.textContent  || "";
                var currency = card.getElementsByTagName("currency")[0]?.textContent  || "";
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
                    "                        <button class=\"icon-button\" aria-label=\"Edit\">\n" +
                    "                            <i class=\"fas fa-edit\"></i>\n" +
                    "                        </button>\n" +
                    "                        <button class=\"icon-button\" aria-label=\"Delete\">\n" +
                    "                            <i class=\"fas fa-trash\"></i>\n" +
                    "                        </button>\n" +
                    "                    </div>\n" +
                    "                </article>"

            });

        })
        .catch(error => {
            console.error("Fehler beim Laden der XML:", error);
        });

}
