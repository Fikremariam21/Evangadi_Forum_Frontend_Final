import React from "react";
import { Link } from "react-router-dom";
import logo from "../../Images/evangadi-logo.png";
import "./Footer.css";
import "@fortawesome/fontAwesome-free/css/all.min.css";

function Footer() {
  return (
    <div className="footer">
      <div className="container ">
        {/* Change justify-content-center to justify-content-between */}
        {/* Remove text-md-start */}
        <div className=" link_container row justify-content-between text-center">

          {/* Remove align-items-md-start */}
          <div className="col-12 col-md-4 mb-4 mb-md-0">
            <div className="footer_logo d-flex flex-column align-items-center">
              <img src={logo} alt="Evangadi Logo" className="mb-3" />
              <div className="social-icons">
                <Link to="https://www.facebook.com/evangaditech" target="_blank">
                  <i className="fab fa-facebook mx-2"></i>
                </Link>
                <Link to="">
                  <i className="fab fa-youtube mx-2"></i>
                </Link>
                <Link to="https://www.instagram.com/evangaditech/" target="_blank">
                  <i className="fab fa-instagram mx-2"></i>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4 mb-4 mb-md-0">
            <h5 className="title">Useful Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/how-it-works">How it Works</Link>
              </li>
              <li className="mb-2">
                <Link to="https://www.evangadi.com/legal/terms/" target="_blank">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="https://www.evangadi.com/legal/privacy/" target="_blank">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-12 col-md-4">
            <h5 className="title">Contact Info</h5>
            <ul className="list-unstyled">
              <li className="mb-2">Evangadi Networks</li>
              <li className="mb-2">support@evangadi.com</li>
              <li>+1-202-386-2702</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;