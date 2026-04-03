import "./DataTreatmentAuthorization.scss";

export const DataTreatmentAuthorization = () => {
  return (
    <div className="data-protection">
      <div className="data-protection__container">
        <header className="data-protection__header">
          <h1 className="data-protection__title">Autorización para el tratamiento de datos personales</h1>
        </header>

        <main className="data-protection__content">
          <section className="data-protection__intro">
            <p className="data-protection__subtitle">
              Para asignar un turno y mejorar nuestro servicio, necesitamos su consentimiento para tratar sus datos personales de
              acuerdo a nuestra política de privacidad.
            </p>
          </section>

          <section className="data-protection__main-clause">
            <h2 className="data-protection__section-title">Cláusula de Autorización para el Tratamiento de Datos Personales</h2>
            <p className="data-protection__text">
              El titular de los datos personales autoriza de manera previa, expresa e informada a{" "}
              <strong>NOVATECHH S.A.S.</strong>, identificada con NIT <strong>901973893-3</strong>, para que realice la
              recolección, almacenamiento, uso, circulación, supresión, actualización y, en general, el tratamiento de sus datos
              personales, conforme a lo dispuesto en la Ley 1581 de 2012, el Decreto 1377 de 2013 y demás normas que los
              modifiquen, adicionen o sustituyan.
            </p>

            <p className="data-protection__text">
              Los datos personales serán utilizados para las siguientes finalidades: (i) gestión administrativa, comercial y
              contable; (ii) contacto y envío de información relacionada con productos y servicios; (iii) cumplimiento de
              obligaciones contractuales y legales; (iv) atención de peticiones, quejas y reclamos; y (v) las demás finalidades
              necesarias para el desarrollo del objeto social de la compañía.
            </p>

            <p className="data-protection__text">
              El titular de los datos reconoce que ha sido informado de sus derechos, los cuales incluyen: conocer, actualizar y
              rectificar sus datos personales; solicitar prueba de la autorización otorgada; ser informado sobre el uso que se ha
              dado a sus datos; presentar quejas ante la Superintendencia de Industria y Comercio; revocar la autorización y/o
              solicitar la supresión del dato cuando no se respeten los principios, derechos y garantías legales; y acceder en
              forma gratuita a sus datos personales.
            </p>

            <p className="data-protection__text">
              Para el ejercicio de sus derechos, el titular podrá contactar a <strong>NOVATECHH S.A.S.</strong> a través del
              correo electrónico: <a href="mailto:administacion@novatechh.com">administracion@novatechh.com</a>.
            </p>

            <p className="data-protection__text">
              <strong>NOVATECHH S.A.S.</strong> se compromete a dar cumplimiento a su Política de Tratamiento de Datos Personales,
              la cual se encuentra disponible para consulta del titular cuando este lo requiera.
            </p>
          </section>
        </main>

        <footer className="data-protection__footer">
          <button className="data-protection__close-btn" onClick={() => window.close()}>
            Cerrar ventana
          </button>
        </footer>
      </div>
    </div>
  );
};
