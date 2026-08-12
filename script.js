/* ==================================================
   CẤU HÌNH API
================================================== */

const API_URL =
    "https://script.google.com/macros/s/AKfycbzk6b7gDlzwiToFBVs_lvz7BhVj4_n1UojfDpbma8VctH5VvaoAkqDZzR4FamW7jYg/exec";


/* ==================================================
   LẤY ELEMENT
================================================== */

const form = document.getElementById("lookupForm");

const cccdInput = document.getElementById("cccd");

const lookupButton = document.getElementById("lookupButton");

const message = document.getElementById("message");

const resultBox = document.getElementById("result");


/* ==================================================
   TRA CỨU
================================================== */

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const cccd = cccdInput.value.trim();


    /* ------------------------------------------
       XÓA KẾT QUẢ CŨ
    ------------------------------------------ */

    message.innerHTML = "";
    message.className = "message";

    resultBox.innerHTML = "";
    resultBox.classList.add("hidden");


    /* ------------------------------------------
       KIỂM TRA CCCD
    ------------------------------------------ */

    if (!/^\d{12}$/.test(cccd)) {

        showMessage(
            "Vui lòng nhập đúng 12 số CCCD.",
            "error"
        );

        return;
    }


    /* ------------------------------------------
       LOADING
    ------------------------------------------ */

    lookupButton.disabled = true;

    lookupButton.innerHTML = "ĐANG TRA CỨU...";


    try {

        /* --------------------------------------
           GỌI GOOGLE APPS SCRIPT
        -------------------------------------- */

        const url =
            API_URL +
            "?cccd=" +
            encodeURIComponent(cccd) +
            "&t=" +
            Date.now();


        console.log("Đang gọi API:", url);


        const response = await fetch(url, {
            method: "GET",
            redirect: "follow",
            cache: "no-store"
        });


        console.log(
            "HTTP status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "HTTP " + response.status
            );
        }


        const data = await response.json();


        console.log(
            "Kết quả API:",
            data
        );


        /* --------------------------------------
           KHÔNG TÌM THẤY
        -------------------------------------- */

        if (data.found === false) {

            showMessage(
                "Thông tin thí sinh không có trong danh sách trúng tuyển.",
                "error"
            );

            return;
        }


        /* --------------------------------------
           API CÓ LỖI
        -------------------------------------- */

        if (data.success === false) {

            showMessage(
                data.message ||
                "Không thể thực hiện tra cứu. Vui lòng thử lại sau.",
                "error"
            );

            return;
        }


        /* --------------------------------------
           KIỂM TRA DATA
        -------------------------------------- */

        if (!data.data) {

            showMessage(
                "Không nhận được dữ liệu thí sinh.",
                "error"
            );

            return;
        }


        /* --------------------------------------
           HIỂN THỊ KẾT QUẢ
        -------------------------------------- */

        showResult(data.data);


    } catch (error) {

        console.error(
            "API ERROR:",
            error
        );


        showMessage(
            "Không thể kết nối đến hệ thống tra cứu. Vui lòng thử lại sau.",
            "error"
        );


    } finally {

        lookupButton.disabled = false;

        lookupButton.innerHTML =
            "TRA CỨU KẾT QUẢ";

    }

});


/* ==================================================
   HIỂN THỊ KẾT QUẢ
================================================== */

function showResult(data) {


    /* ------------------------------------------
       NÚT XEM GIẤY BÁO
    ------------------------------------------ */

    const viewButton =
        data.linkGiayBao
            ? `
                <a
                    href="${escapeAttribute(data.linkGiayBao)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="document-button view-button"
                >
                    <span class="button-icon">↗</span>
                    XEM GIẤY BÁO
                </a>
              `
            : "";


    /* ------------------------------------------
       NÚT TẢI GIẤY BÁO
    ------------------------------------------ */

    const downloadButton =
        data.linkTaiGiayBao
            ? `
                <a
                    href="${escapeAttribute(data.linkTaiGiayBao)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="document-button download-button"
                >
                    <span class="button-icon">↓</span>
                    TẢI GIẤY BÁO
                </a>
              `
            : "";


    /* ------------------------------------------
       KHU VỰC GIẤY BÁO
    ------------------------------------------ */

    let documentSection = "";


    if (
        data.linkGiayBao ||
        data.linkTaiGiayBao
    ) {

        documentSection = `

            <div class="document-section">

                <div class="document-title">

                    <span class="document-icon">
                        PDF
                    </span>

                    <div>

                        <strong>
                            GIẤY BÁO TRÚNG TUYỂN
                        </strong>

                        <small>
                            Giấy báo điện tử của thí sinh
                        </small>

                    </div>

                </div>


                <div class="document-buttons">

                    ${viewButton}

                    ${downloadButton}

                </div>

            </div>

        `;

    } else {

        documentSection = `

            <div class="document-section document-unavailable">

                <div class="document-title">

                    <span class="document-icon">
                        PDF
                    </span>

                    <div>

                        <strong>
                            GIẤY BÁO TRÚNG TUYỂN
                        </strong>

                        <small>
                            Giấy báo đang được cập nhật.
                        </small>

                    </div>

                </div>

            </div>

        `;

    }


    /* ------------------------------------------
       HIỂN THỊ CARD
    ------------------------------------------ */

    resultBox.innerHTML = `

        <div class="result-card">

            <div class="success-icon">
                ✓
            </div>


            <h2>
                CHÚC MỪNG!
            </h2>


            <p class="result-subtitle">
                Thí sinh đã trúng tuyển.
            </p>


            <div class="student-info">


                <div class="info-row">

                    <span>
                        Họ và tên
                    </span>

                    <strong>
                        ${escapeHtml(data.hoTen)}
                    </strong>

                </div>


                <div class="info-row">

                    <span>
                        Ngày sinh
                    </span>

                    <strong>
                        ${escapeHtml(data.ngaySinh)}
                    </strong>

                </div>


                <div class="info-row">

                    <span>
                        Số báo danh
                    </span>

                    <strong>
                        ${escapeHtml(data.soBaoDanh)}
                    </strong>

                </div>


                <div class="info-row">

                    <span>
                        Ngành trúng tuyển
                    </span>

                    <strong>
                        ${escapeHtml(data.nganhTrungTuyen)}
                    </strong>

                </div>


                <div class="info-row">

                    <span>
                        Nguyện vọng trúng tuyển
                    </span>

                    <strong>
                        ${escapeHtml(data.nvTrungTuyen)}
                    </strong>

                </div>


                <div class="info-row">

                    <span>
                        Trạng thái
                    </span>

                    <strong>

                        <span class="status-badge">
                            TRÚNG TUYỂN
                        </span>

                    </strong>

                </div>


            </div>


            ${documentSection}


        </div>

    `;


    /* ------------------------------------------
       HIỆN KẾT QUẢ
    ------------------------------------------ */

    resultBox.classList.remove("hidden");


    /* ------------------------------------------
       CUỘN ĐẾN KẾT QUẢ
    ------------------------------------------ */

    setTimeout(function () {

        resultBox.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 100);

}


/* ==================================================
   MESSAGE
================================================== */

function showMessage(text, type) {

    message.innerHTML =
        escapeHtml(text);

    message.className =
        "message " + type;

}


/* ==================================================
   ESCAPE HTML
================================================== */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* ==================================================
   ESCAPE ATTRIBUTE
================================================== */

function escapeAttribute(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "#";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/"/g, "&quot;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;");

}
