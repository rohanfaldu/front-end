export default function ContactPopup({ contactModelPopup, contactDetail, onClose }) {
    if (!contactModelPopup || !contactDetail) return null;
  
    return (
      <div className="modal" style={{ display: 'block', position: 'fixed', zIndex: 1000, top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="modal-content-alert login-alert-sec">
          <span
            className="close-modal icon-close2 contact-close-popup"
            onClick={onClose}
            style={{ cursor: 'pointer' }}
          />
          <>
            <img
              src={contactDetail.image}
              alt="User"
              style={{ width: '150px', marginBottom: '15px', borderRadius: '50%' }}
            />
            <h4 className="contact-user-name">{contactDetail.userName}</h4>
  
            <div className="contact-email-sec">
              <i className="icon icon-mail fs-20 text-variant-2" />
              <span className="contact-user-email">{contactDetail.email_address}</span>
            </div>
  
            <div className="contact-call-sec">
              <i className="icon icon-phone2 fs-20 text-variant-2" />
              <a
                href={`tel:${contactDetail.country_code}${contactDetail.mobile_number}`}
                className="contact-user-phone"
              >
                {contactDetail.country_code} {contactDetail.mobile_number}
              </a>
            </div>
          </>
        </div>
      </div>
    );
  }
  