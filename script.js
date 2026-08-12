/* ==========================================
   API URL
========================================== */

const API_URL =
    "https://script.google.com/macros/s/AKfycbx1CNjdO_zLH8Xr4Jw7gD26vS2J3NoRYCEu1s5piPh0QFZ7FAJfTrndcu9fnPg1Ji4/exec";


/* ==========================================
   ELEMENTS
========================================== */

const cccdInput =
    document.getElementById("cccd");

const searchBtn =
    document.getElementById("searchBtn");

const buttonText =
    document.getElementById("buttonText");

const buttonLoading =
    document.getElementById("buttonLoading");

const message =
    document.getElementById("message");

const resultCard =
    document.getElementById("resultCard");

const resultIcon =
    document.getElementById("resultIcon");

const resultTitle =
    document.getElementById("resultTitle");

const resultDescription =
    document.getElementById("resultDescription");

const studentName =
    document.getElementById("studentName");

const studentSBD =
    document.getElementById("studentSBD");

const studentDob =
    document.getElementById("studentDob");

const studentMajor =
    document.getElementById("studentMajor");

const studentNV =
    document.getElementById("studentNV");

const studentStatus =
    document.getElementById("studentStatus");


/* GIẤY BÁO */

const letterSection =
    document.getElementById("letterSection");

const letterMessage =
    document.getElementById("letterMessage");

const letterButtons =
    document.getElementById("letterButtons");

const viewLetterBtn =
    document.getElementById("viewLetterBtn");

const downloadLetterBtn =
    document.getElementById("downloadLetterBtn");


/* ==========================================
   MESSAGE
========================================== */

function showMessage(text) {

    message.textContent =
        text;

    message.className =
        "message error";

    message.hidden =
        false;

}


function hideMessage() {

    message.hidden =
        true;

}


/* ==========================================
   RESULT
========================================== */

function hideResult() {

    resultCard.hidden =
        true;

}


/* ==========================================
   LETTER RESET
========================================== */

function resetLetter() {

    letterSection.hidden =
        true;

    letterButtons.hidden =
        true;

    letterMessage.textContent =
        "";

    viewLetterBtn.href =
        "#";

    downloadLetterBtn.href =
        "#";

}


/* ==========================================
   LOADING
========================================== */

function setLoading(
    isLoading
) {

    searchBtn.disabled =
        isLoading;

    buttonText.hidden =
        isLoading;

    buttonLoading.hidden =
        !isLoading;

}


/* ==========================================
   CLEAN CCCD
========================================== */

function cleanCCCD(
    value
) {

    return value
        .replace(
            /\D/g,
            ""
        )
        .slice(
            0,
            12
        );

}


/* ==========================================
   SHOW RESULT
========================================== */

function showResult(
    data
) {

    hideMessage();

    resultCard.hidden =
        false;


    /* THÔNG TIN */

    studentName.textContent =
        data.name || "—";


    studentSBD.textContent =
        data.sbd || "—";


    studentDob.textContent =
        data.dob || "—";


    studentMajor.textContent =
        data.major || "—";


    studentNV.textContent =
        data.nv || "—";


    studentStatus.textContent =
        "TRÚNG TUYỂN";


    /* HEADER */

    resultIcon.textContent =
        "✓";

    resultTitle.textContent =
        "CHÚC MỪNG!";

    resultDescription.textContent =
        "Thí sinh đã trúng tuyển.";


    /* GIẤY BÁO */

    resetLetter();


    letterSection.hidden =
        false;


    if (
        data.letterFound &&
        data.letterUrl
    ) {

        letterMessage.textContent =
            "Giấy báo trúng tuyển đã được cập nhật.";


        letterButtons.hidden =
            false;


        viewLetterBtn.href =
            data.letterUrl;


        downloadLetterBtn.href =
            data.letterDownloadUrl;


    }

    else {

        letterMessage.textContent =
            "Giấy báo trúng tuyển đang được cập nhật. Vui lòng quay lại sau.";

    }

}


/* ==========================================
   SEARCH
========================================== */

async function searchAdmission() {


    const cccd =
        cleanCCCD(
            cccdInput.value
        );


    cccdInput.value =
        cccd;


    hideMessage();

    hideResult();

    resetLetter();


    /* --------------------------------------
       EMPTY
    -------------------------------------- */

    if (!cccd) {

        showMessage(
            "Vui lòng nhập số CCCD."
        );

        cccdInput.focus();

        return;

    }


    /* --------------------------------------
       12 DIGITS
    -------------------------------------- */

    if (
        cccd.length !== 12
    ) {

        showMessage(
            "Số CCCD phải gồm 12 chữ số."
        );

        cccdInput.focus();

        return;

    }


    setLoading(
        true
    );


    try {


        const url =
            API_URL +
            "?cccd=" +
            encodeURIComponent(
                cccd
            );


        const response =
            await fetch(
                url,
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "API request failed"
            );

        }


        const result =
            await response.json();


        /* ----------------------------------
           API ERROR
        ---------------------------------- */

        if (
            !result.success
        ) {

            showMessage(
                result.message ||
                "Có lỗi xảy ra. Vui lòng thử lại."
            );

            return;

        }


        /* ----------------------------------
           KHÔNG CÓ CCCD
        ---------------------------------- */

        if (
            !result.found
        ) {

            showMessage(
                "Thông tin thí sinh không có trong danh sách trúng tuyển."
            );

            return;

        }


        /* ----------------------------------
           CÓ CCCD
        ---------------------------------- */

        showResult(
            result.data
        );


    }

    catch (error) {

        console.error(
            error
        );


        showMessage(
            "Không thể kết nối đến hệ thống tra cứu. Vui lòng thử lại sau."
        );

    }

    finally {

        setLoading(
            false
        );

    }

}


/* ==========================================
   INPUT
========================================== */

cccdInput.addEventListener(
    "input",
    function () {

        this.value =
            cleanCCCD(
                this.value
            );

    }
);


/* ==========================================
   ENTER
========================================== */

cccdInput.addEventListener(
    "keydown",
    function (
        event
    ) {

        if (
            event.key === "Enter"
        ) {

            searchAdmission();

        }

    }
);


/* ==========================================
   BUTTON
========================================== */

searchBtn.addEventListener(
    "click",
    searchAdmission
);
