/* ==========================================
   API URL
========================================== */

const API_URL =
    "https://script.google.com/macros/s/AKfycbxYLHX8NjrsXvbpws0ueYThj9tN-wds7YWBg1rTvcezllFDTAa4q7tjZoPhuRk9vqc/exec";


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


/* ==========================================
   SHOW MESSAGE
========================================== */

function showMessage(text) {

    message.textContent =
        text;

    message.className =
        "message error";

    message.hidden =
        false;

}


/* ==========================================
   HIDE MESSAGE
========================================== */

function hideMessage() {

    message.hidden =
        true;

}


/* ==========================================
   HIDE RESULT
========================================== */

function hideResult() {

    resultCard.hidden =
        true;

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
   DISPLAY RESULT
========================================== */

function showResult(
    data
) {


    hideMessage();


    resultCard.hidden =
        false;


    resultCard.className =
        "result-card result-pass";


    /* --------------------------------------
       ICON
    -------------------------------------- */

    resultIcon.textContent =
        "✓";


    /* --------------------------------------
       TITLE
    -------------------------------------- */

    resultTitle.textContent =
        "CHÚC MỪNG!";


    /* --------------------------------------
       DESCRIPTION
    -------------------------------------- */

    resultDescription.textContent =
        "Thí sinh đã trúng tuyển.";


    /* --------------------------------------
       HỌ TÊN
    -------------------------------------- */

    studentName.textContent =
        data.name || "—";


    /* --------------------------------------
       SỐ BÁO DANH
    -------------------------------------- */

    studentSBD.textContent =
        data.sbd || "—";


    /* --------------------------------------
       NGÀY SINH
    -------------------------------------- */

    studentDob.textContent =
        data.dob || "—";


    /* --------------------------------------
       NGÀNH TRÚNG TUYỂN
    -------------------------------------- */

    studentMajor.textContent =
        data.major || "—";


    /* --------------------------------------
       NGUYỆN VỌNG TRÚNG TUYỂN
    -------------------------------------- */

    studentNV.textContent =
        data.nv || "—";


    /* --------------------------------------
       TRẠNG THÁI
    -------------------------------------- */

    studentStatus.textContent =
        "TRÚNG TUYỂN";

}


/* ==========================================
   SEARCH ADMISSION
========================================== */

async function searchAdmission() {


    /* --------------------------------------
       LẤY CCCD
    -------------------------------------- */

    const cccd =
        cleanCCCD(
            cccdInput.value
        );


    cccdInput.value =
        cccd;


    hideMessage();

    hideResult();


    /* --------------------------------------
       KIỂM TRA RỖNG
    -------------------------------------- */

    if (!cccd) {

        showMessage(
            "Vui lòng nhập số CCCD."
        );

        cccdInput.focus();

        return;

    }


    /* --------------------------------------
       KIỂM TRA 12 SỐ
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


    /* --------------------------------------
       LOADING
    -------------------------------------- */

    setLoading(
        true
    );


    try {


        /* ----------------------------------
           API URL
        ---------------------------------- */

        const url =
            API_URL +
            "?cccd=" +
            encodeURIComponent(
                cccd
            );


        /* ----------------------------------
           CALL API
        ---------------------------------- */

        const response =
            await fetch(
                url,
                {
                    method: "GET",

                    cache: "no-store"
                }
            );


        /* ----------------------------------
           RESPONSE ERROR
        ---------------------------------- */

        if (
            !response.ok
        ) {

            throw new Error(
                "API request failed"
            );

        }


        /* ----------------------------------
           JSON
        ---------------------------------- */

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
           CCCD KHÔNG CÓ TRONG DANH SÁCH
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
           CCCD CÓ TRONG DANH SÁCH
           → TRÚNG TUYỂN
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
   INPUT EVENT
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
   ENTER KEY
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
