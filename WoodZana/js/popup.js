
function activate(el) {
    if (!(el.classList.contains('active'))) {
        el.classList.add('active');
    }
}

function disactivate(el) {
    if (el.classList.contains('active')) {
        el.classList.remove('active');
    }
}

class RosePopup { // use data-rosePopup="main"
    constructor(id = 'main-popup') {
        try {
            this.popup = document.querySelector('#' + id);
        } catch(err) {
            console.log('Popup was not found');
        }

        let submitBtn = this.popup.querySelector('.popup-submit');
        
        this.wasConfirmed = new Event('rose-submit');

        document.addEventListener('click', e => {
            try {
                if (e.target.closest(`[data-rosePopup = "${id}" ]`)) {this.constructor.open(this.popup);}
            } catch (err) {
                console.error(err);
            }
        });

        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();

                this.popup.dispatchEvent(this.wasConfirmed);
                if (submitBtn.dataset.noclose) return;
                this.constructor.close(this.popup);

                // this.popup.addEventListener('transitionend', () =>{
                //     this.constructor.reset(this.popup);
                // }, {once: true});
                
            });
        }
        
        if (this.popup) {this.popup.addEventListener('click', e =>  this.closeRosePopup.call(this, e));}
    }

    closeRosePopup(e) {
        if (e.target == this.popup || e.target.closest('.close') ) this.constructor.close(this.popup);
    }

    static reset(popup) {
        let inputs = popup.querySelectorAll('input, .rose-select');

        inputs.forEach(element => {
            if (element.value) {
                element.value = '';
                }

            if (element.dataset.value) {
                element.dataset.value = '';
                element.firstElementChild.innerHTML = 'Не вибрано';
                element.querySelectorAll('.option.checked').forEach(el => el.classList.remove('checked'));
            }
        });
    }

    static ask(popup, callback) {
        let func = function() {
            callback();
            popup.removeEventListener('rose-submit', func);
        }

        popup.addEventListener('rose-submit', func);
    }

    static open(popup) {
        let wasOpened = new Event('open');

        popup.dispatchEvent(wasOpened);
        activate(popup);
    }

    static close(popup) {
        let wasClosed = new Event('close');

        popup.dispatchEvent(wasClosed);
        disactivate(popup);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        new RosePopup('contact-popup');
        new RosePopup('menu');
    } catch(e) {
        console.error(e)
    }
}); 

