import swal from 'sweetalert2'

const AlerService = {
  swal: swal,

  errorPopup: (title, message, cb) => {
    AlerService.__showPopup({
      title: title,
      type: 'error',
      text: message,
    }, cb)
  },

  successPopup: (title, message, cb) => {
    AlerService.__showPopup({
      title: title,
      type: 'success',
      text: message,
      customClass: 'success-popup'
    }, cb)
  },
  infoPopup: (title, message, cb) => {
    AlerService.__showPopup({
      title: title,
      type: 'info',
      text: message,
      showCancelButton: true,
      focusConfirm: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    }, cb)
  },
  notifyPopup: (title, message, cb) => {
    AlerService.__showPopup({
      title: title,
      type: 'info',
      text: message,
      showCancelButton: false,
      focusConfirm: true,
      confirmButtonText: 'Ok',
    }, cb)
  },
  warningPopup: (title, message, cb) => {
    AlerService.__showPopup({
      title: title,
      type: 'warning',
      text: message,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      customClass: 'warning-popup',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#aaa',
      cancelButtonColor: '#3085d6',
      customClass: 'error-popup',
      reverseButtons: true,
      focusConfirm: false,
      focusCancel: true,
    }, cb)
  },

  loadingPopup: () => {
    AlerService.swal({
      html: `
      <div class="lds-css ng-scope">
      <div style="width:100%;height:100%;margin: 0 auto;" class="lds-ellipsis">
      <div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div></div><style type="text/css">@keyframes lds-ellipsis3 {
        0%, 25% {
          left: 32px;
          -webkit-transform: scale(0);
          transform: scale(0);
        }
        50% {
          left: 32px;
          -webkit-transform: scale(1);
          transform: scale(1);
        }
        75% {
          left: 100px;
        }
        100% {
          left: 168px;
          -webkit-transform: scale(1);
          transform: scale(1);
        }
      }
      @-webkit-keyframes lds-ellipsis3 {
        0%, 25% {
          left: 32px;
          -webkit-transform: scale(0);
          transform: scale(0);
        }
        50% {
          left: 32px;
          -webkit-transform: scale(1);
          transform: scale(1);
        }
        75% {
          left: 100px;
        }
        100% {
          left: 168px;
          -webkit-transform: scale(1);
          transform: scale(1);
        }
      }
      @keyframes lds-ellipsis2 {
        0% {
          -webkit-transform: scale(1);
          transform: scale(1);
        }
        25%, 100% {
          -webkit-transform: scale(0);
          transform: scale(0);
        }
      }
      @-webkit-keyframes lds-ellipsis2 {
        0% {
          -webkit-transform: scale(1);
          transform: scale(1);
        }
        25%, 100% {
          -webkit-transform: scale(0);
          transform: scale(0);
        }
      }
      @keyframes lds-ellipsis {
        0% {
          left: 32px;
          -webkit-transform: scale(0);
          transform: scale(0);
        }
        25% {
          left: 32px;
          -webkit-transform: scale(1);
          transform: scale(1);
        }
        50% {
          left: 100px;
        }
        75% {
          left: 168px;
          -webkit-transform: scale(1);
          transform: scale(1);
        }
        100% {
          left: 168px;
          -webkit-transform: scale(0);
          transform: scale(0);
        }
      }
      @-webkit-keyframes lds-ellipsis {
        0% {
          left: 32px;
          -webkit-transform: scale(0);
          transform: scale(0);
        }
        25% {
          left: 32px;
          -webkit-transform: scale(1);
          transform: scale(1);
        }
        50% {
          left: 100px;
        }
        75% {
          left: 168px;
          -webkit-transform: scale(1);
          transform: scale(1);
        }
        100% {
          left: 168px;
          -webkit-transform: scale(0);
          transform: scale(0);
        }
      }
      .lds-ellipsis {
        position: relative;
      }
      .lds-ellipsis > div {
        position: absolute;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
      }
      .lds-ellipsis div > div {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #f00;
        position: absolute;
        top: 100px;
        left: 32px;
        -webkit-animation: lds-ellipsis 3.3s cubic-bezier(0, 0.5, 0.5, 1) infinite forwards;
        animation: lds-ellipsis 3.3s cubic-bezier(0, 0.5, 0.5, 1) infinite forwards;
      }
      .lds-ellipsis div:nth-child(1) div {
        -webkit-animation: lds-ellipsis2 3.3s cubic-bezier(0, 0.5, 0.5, 1) infinite forwards;
        animation: lds-ellipsis2 3.3s cubic-bezier(0, 0.5, 0.5, 1) infinite forwards;
        background: #3b4368;
      }
      .lds-ellipsis div:nth-child(2) div {
        -webkit-animation-delay: -1.65s;
        animation-delay: -1.65s;
        background: #5e6fa3;
      }
      .lds-ellipsis div:nth-child(3) div {
        -webkit-animation-delay: -0.825s;
        animation-delay: -0.825s;
        background: #689cc5;
      }
      .lds-ellipsis div:nth-child(4) div {
        -webkit-animation-delay: 0s;
        animation-delay: 0s;
        background: #93dbe9;
      }
      .lds-ellipsis div:nth-child(5) div {
        -webkit-animation: lds-ellipsis3 3.3s cubic-bezier(0, 0.5, 0.5, 1) infinite forwards;
        animation: lds-ellipsis3 3.3s cubic-bezier(0, 0.5, 0.5, 1) infinite forwards;
        background: #3b4368;
      }
      .lds-ellipsis {
        width: 125px !important;
        height: 125px !important;
        -webkit-transform: translate(-62.5px, -62.5px) scale(0.625) translate(62.5px, 62.5px);
        transform: translate(-62.5px, -62.5px) scale(0.625) translate(62.5px, 62.5px);
      }
      </style></div>
      `,
      showConfirmButton: false,
      allowOutsideClick: false
    })
  },

  __showPopup: (config, cb) => {
    if (cb) {
      swal(config).then(cb)
    } else {
      swal(config)
    }
  }
}

export default AlerService
