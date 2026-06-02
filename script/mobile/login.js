(function () {
const inputUser = document.getElementById('inputUsername');
const inputPw   = document.getElementById('inputPassword');
const loginBtn  = document.getElementById('loginBtn');
const toast     = document.getElementById('toast');

const errUser   = document.getElementById('errUser');
const errPw     = document.getElementById('errPw');
const errCreds  = document.getElementById('errCreds');
const errLocked = document.getElementById('errLocked');

/* Demo credentials */
const VALID  = { 'bob@example.com': '10203040' };
const LOCKED = new Set(['alice@example.com']);

/* ── Auto-fill clicks ── */
document.querySelectorAll('.hint-item[data-user]').forEach(el => {
    el.addEventListener('click', () => {
        inputUser.value = el.dataset.user;
        inputPw.value   = '10203040';
        clearErrors();
    });
});
document.querySelectorAll('.hint-item[data-pw]').forEach(el => {
    el.addEventListener('click', () => {
        inputPw.value = el.dataset.pw;
        clearErrors();
    });
});

/* ── Clear errors on input ── */
inputUser.addEventListener('input', clearErrors);
inputPw.addEventListener('input', clearErrors);

function clearErrors() {
    [errUser, errPw, errCreds, errLocked].forEach(e => e.classList.remove('visible'));
}

/* ── Submit ── */
loginBtn.addEventListener('click', submit);
[inputUser, inputPw].forEach(el =>
    el.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); })
);

function submit() {
    clearErrors();
    const user = inputUser.value.trim();
    const pw   = inputPw.value;
    let ok = true;

    if (!user) { errUser.classList.add('visible'); ok = false; }
    if (!pw)   { errPw.classList.add('visible');   ok = false; }
    if (!ok) return;

    loginBtn.disabled = true;
    loginBtn.innerHTML = '<span class="spinner"></span>Logging in…';

    setTimeout(() => {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';

        if (LOCKED.has(user))   { errLocked.classList.add('visible'); return; }
        if (VALID[user] !== pw) { errCreds.classList.add('visible');  return; }

        showToast('Logged in successfully!');
        setTimeout(() => { window.location.href = './catalog.html'; }, 800);
    }, 800);
}

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2400);
}
})();