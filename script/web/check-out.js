function handleContinue() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const zipCode = document.getElementById('zipCode').value.trim();

    if(firstName === '' || lastName === '' || zipCode === '') {
        alert('Vui lòng nhập thông tin người dùng.');
        return;
    }

    const userInfo = { 
        firstName: firstName, 
        lastName: lastName, 
        zipCode: zipCode };
        localStorage.setItem('checkoutInfo', JSON.stringify(userInfo));
        window.location.href = './check-out-over-view.html';
}
function handleCancel() {
    window.location.href = './cart.html';
}