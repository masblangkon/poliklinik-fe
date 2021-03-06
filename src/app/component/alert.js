import swal from "sweetalert";

export function dialog (config) {
  return new Promise( async(resolve, reject) => {
    const result = await swal({
      
      confirm: true,
      buttons: {
        confirm: {
          text: "OK",
          value: true,
          visible: true,
          className: 'app-btn'
        },
      },
      ...config
    });


    result ? resolve(result) : reject(result);
  })
}

export function logoutDialog (config) {
  return new Promise( async(resolve, reject) => {
    const result = await swal({
      
      confirm: true,
      buttons: {
        cancel: {
          text: "Batal",
          value: false,
          visible: true,
          className: 'app-btn'
        },
        confirm: {
          text: "Logout",
          value: true,
          visible: true,
          className: 'app-btn red',
        },
      },
      ...config
    });

    result ? resolve(result) : reject(result);
  })
}

export function deleteDialog (config) {
  return new Promise( async(resolve, reject) => {
    const result = await swal({
      
      confirm: true,
      buttons: {
        cancel: {
          text: "Batal",
          value: false,
          visible: true,
          className: 'app-btn'
        },
        confirm: {
          text: "Hapus",
          value: true,
          visible: true,
          className: 'app-btn'
        },
      },
      ...config
    });

    result ? resolve(result) : reject(result);
  })
}

export function verifDialog (config) {
  return new Promise( async(resolve, reject) => {
    const result = await swal({
      
      title: "Verifikasi Pendaftaran",
      text: "Harap masukkan Kode OTP yang dikirim ke nomor telepon Anda",
      content: {
        element: "input",
        attributes: {
          type: "number",
          placeholder: "Kode OTP",
        },
      },
      confirm: true,
      buttons: {
        confirm: {
          text: "Konfirmasi",
          value: false,
          visible: true,
          className: 'app-btn'
        },
      },
      ...config
    });

    
    result ? resolve(result) : reject(result);
  })
}