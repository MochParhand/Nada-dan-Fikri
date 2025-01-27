import { comment } from './comment.js';

export const pagination = (() => {
    let perPage = 0;
    let pageNow = 0; // Default page to 0
    let resultData = 0;

    /**
     * @type {HTMLElement|null}
     */
    let page = null;

    /**
     * @type {HTMLElement|null}
     */
    let liPrev = null;

    /**
     * @type {HTMLElement|null}
     */
    let liNext = null;

    /**
     * @type {HTMLElement|null}
     */
    let paginate = null;

    /**
     * @param {number} num 
     * @returns {void}
     */
    const setPer = (num) => {
        perPage = Number(num);
        if (paginate) {
            paginate.style.display = perPage === 0 ? 'none' : 'block';
        }
    };

    /**
     * @returns {number}
     */
    const getPer = () => perPage;

    /**
     * @returns {number}
     */
    const getNext = () => pageNow;

    /**
     * @returns {void}
     */
    const disabledPrevious = () => !liPrev.classList.contains('disabled') ? liPrev.classList.add('disabled') : null;

    /**
     * @returns {void}
     */
    const enablePrevious = () => liPrev.classList.contains('disabled') ? liPrev.classList.remove('disabled') : null;

    /**
     * @returns {void}
     */
    const disabledNext = () => !liNext.classList.contains('disabled') ? liNext.classList.add('disabled') : null;

    /**
     * @returns {void}
     */
    const enableNext = () => liNext.classList.contains('disabled') ? liNext.classList.remove('disabled') : null;

    /**
     * @returns {void}
     */
    const enablePagination = () => {
        if (paginate.classList.contains('d-none')) {
            paginate.classList.remove('d-none');
        }
    };

    /**
     * @param {HTMLButtonElement} button 
     * @returns {object}
     */
    const buttonAction = (button) => {
        button.disabled = true;
        const tmp = button.innerHTML;
        button.innerHTML = `<span class="spinner-border spinner-border-sm my-0 mx-1 p-0" style="height: 0.8rem; width: 0.8rem;"></span>`;

        const process = async () => {
            await comment.comment();

            button.disabled = false;
            button.innerHTML = tmp;

            comment.scroll();
        };

        const next = async () => {
            pageNow += perPage;

            button.innerHTML = 'Next' + button.innerHTML;
            await process();
            page.innerText = String(parseInt(page.innerText) + 1);
        };

        const prev = async () => {
            pageNow -= perPage;

            button.innerHTML = button.innerHTML + 'Prev';
            await process();
            page.innerText = String(parseInt(page.innerText) - 1);
        };

        return {
            next,
            prev,
        };
    };

    /**
     * @returns {Promise<boolean>}
     */
    const reset = async () => {
        pageNow = 0;
        resultData = 0;
        page.innerText = 0; // Set to 0

        disabledNext();
        disabledPrevious();
        await comment.comment();

        return true;
    };

    /**
     * @param {number} len 
     * @returns {void}
     */
    const setResultData = (len) => {
        resultData = len;

        if (pageNow > 0) {
            enablePrevious();
        }

        if (resultData < perPage) {
            disabledNext();
            return;
        }

        enableNext();
        enablePagination();
    };

    /**
     * @param {HTMLButtonElement} button 
     * @returns {Promise<void>}
     */
    const previous = async (button) => {
        disabledPrevious();

        if (pageNow <= 0) { // Allow 0
            return;
        }

        pageNow -= 1;
        page.innerText = pageNow;
        disabledNext();
        await buttonAction(button).prev();
    };

    /**
     * @param {HTMLButtonElement} button 
     * @returns {Promise<void>}
     */
    const next = async (button) => {
        disabledNext();

        if (resultData < perPage) {
            return;
        }

        pageNow += 1;
        page.innerText = pageNow;
        disabledPrevious();
        await buttonAction(button).next();
    };

    /**
     * @returns {void}
     */
    const init = () => {
        paginate = document.getElementById('pagination');
        
        if (perPage === 0) {
            // Jika perPage = 0, sembunyikan pagination
            paginate.style.display = 'none';
            return;
        }

        paginate.style.display = 'block'; // Pastikan pagination terlihat jika perPage > 0
        paginate.innerHTML = `
        <ul class="pagination mb-2 shadow-sm rounded-4">
            <li class="page-item disabled" id="previous">
                <button class="page-link rounded-start-4" onclick="undangan.comment.pagination.previous(this)" data-offline-disabled="false">
                    <i class="fa-solid fa-circle-left me-1"></i>Prev
                </button>
            </li>
            <li class="page-item disabled">
                <span class="page-link text-light" id="page">0</span> <!-- Default set to 0 -->
            </li>
            <li class="page-item" id="next">
                <button class="page-link rounded-end-4" onclick="undangan.comment.pagination.next(this)" data-offline-disabled="false">
                    Next<i class="fa-solid fa-circle-right ms-1"></i>
                </button>
            </li>
        </ul>`;

        page = document.getElementById('page');
        liPrev = document.getElementById('previous');
        liNext = document.getElementById('next');
    };

    return {
        init,
        setPer,
        getPer,
        getNext,
        reset,
        setResultData,
        previous,
        next,
    };
})();
