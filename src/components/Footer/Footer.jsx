import React from "react";
import { CustomIcon } from "@components/common";
import "./Footer.scss";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__left">
          <span className="footer__copyright">
            &copy; {currentYear} <strong>Digiturno</strong>. Todos los derechos reservados.
          </span>
          <span className="footer__separator">|</span>
          <span className="footer__brand">Desarrollado por Novatech</span>
        </div>

        <div className="footer__right">
          <div className="footer__support-badge">
            <CustomIcon name="mdi:headset-mic" size="sm" />
            <span>Soporte</span>
          </div>

          <div className="footer__contacts">
            <a href="mailto:administracion@novatechh.com" className="footer__contact-item" title="Enviar correo a soporte">
              <CustomIcon name="mdi:email-outline" size="sm" />
              <span>administracion@novatechh.com</span>
            </a>

            <a
              href="https://wa.me/573166929313"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__contact-item footer__contact-item--whatsapp"
              title="Contactar por WhatsApp"
            >
              <CustomIcon name="mdi:whatsapp" size="sm" />
              <span>316 692 9313</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
