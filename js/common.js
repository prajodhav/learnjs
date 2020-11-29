function setActiveOnNavBar(linkNumber) {
    for (i=1;i<6;i++) {
        let navLinkId = "navlink" + (("0" + i).slice(-2));
        let elm = document.getElementById(navLinkId);
        i == linkNumber ? elm.setAttribute("class","nav-item active") :  elm.setAttribute("class","nav-item");
    }
}