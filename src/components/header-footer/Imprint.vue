<template>
  <div class="imprint">
    <section class="imprint__section">
      <h2>Impressum</h2>
      <div class="imprint__content">
        <p>Das Fraunhofer Institut für Offene Kommunikationssysteme Fraunhofer-FOKUS</p>

        <p>
          Kaiserin-Augusta-Allee 31
          <br>
          10589 Berlin
        </p>

        <p>ist eine rechtlich nicht selbstständige Einrichtung der</p>

        <p>
          Fraunhofer-Gesellschaft zur Förderung der angewandten Forschung e.V.
          <br>
          Hansastraße 27c, 80686 München
          <br>
          Telefon +49 89 1205- 0
          <br>
          Fax +49 89 1205-7531
          <br>
          E-Mail: info(at)zv.fraunhofer.de
        </p>

        <p><a href="https://www.fraunhofer.de/">www.fraunhofer.de</a></p>
      </div>
    </section>

    <section class="imprint__section">
      <h2>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz</h2>
      <div class="imprint__content">
        <p>DE 129515865</p>
      </div>
    </section>

    <section class="imprint__section">
      <h2>Registergericht</h2>
      <div class="imprint__content">
        <p>
          Amtsgericht München
          <br>
          Eingetragener Verein
          <br>
          Register-Nr. VR 4461
        </p>
      </div>
    </section>

    <section class="imprint__section">
      <h2>Redaktionsverantwortlich im Sinne des Presserechts</h2>
      <div class="imprint__content">
        <p>
          webteam(at)fokus.fraunhofer.de
          <em>
            Hinweis: Bei allgemeinen Fragen zum Institut, wenden Sie sich bitte an die unter
            <a href="https://www.fokus.fraunhofer.de/de/kontakt">Kontakt</a>
            angegebenen Ansprechpartner
          </em>
        </p>
      </div>
    </section>

    <section class="imprint__section">
      <h2>Vorstand</h2>
      <div class="imprint__content">
        <p>
          <strong>Prof. Dr.-Ing. Holger Hanselka</strong><br>Präsident | Vorstandsressort Unternehmensstrategie und -kommunikation<br><br>
          <strong>Prof. Dr. Constantin Häfner</strong><br>Vorstandsressort VA Forschung und Transfer<br><br>
          <strong>Prof. Dr. Axel Müller-Groeling</strong><br>Vorstandsressort VB Forschungsinfrastrukturen und Digitalisierung<br><br>
          <strong>Elisabeth Ewen</strong><br>Vorstandsressort VC Personal, Unternehmenskultur und Recht<br><br>
          <strong>Dr. Sandra Krey</strong><br>Vorstandsressort VD Finanzen und Controlling
        </p>
      </div>
    </section>

    <section class="imprint__section">
      <h2>Nutzungsrechte</h2>
      <div class="imprint__content">
        <p>
          Copyright © by<br>
          Fraunhofer-Gesellschaft
        </p>

        <p>
          Alle Rechte vorbehalten.<br>
          Die Urheberrechte dieser Web-Site liegen vollständig bei der Fraunhofer-Gesellschaft.
        </p>

        <p>
          Ein Download oder Ausdruck dieser Veröffentlichungen ist ausschließlich für den persönlichen Gebrauch
          gestattet. Alle darüber hinaus gehenden Verwendungen, insbesondere die kommerzielle Nutzung und
          Verbreitung, sind grundsätzlich nicht gestattet und bedürfen der schriftlichen Genehmigung.
        </p>

        <p>
          Anfragen richten Sie bitte an:<br>
          Fraunhofer Institut für Offene Kommunikationssysteme
        </p>

        <p>
          Kaiserin-Augusta-Allee 31
          <br>
          10589 Berlin
        </p>

        <p>
          Ein Download oder Ausdruck ist darüber hinaus lediglich zum Zweck der Berichterstattung über die
          Fraunhofer-Gesellschaft und Ihre Institute nach Maßgabe unten stehender Nutzungsbedingungen gestattet.
        </p>

        <p>
          Grafische Veränderungen an Bildmotiven - außer zum Freistellen des Hauptmotivs - sind nicht gestattet. Es
          ist stets die Quellenangabe und Übersendung von zwei kostenlosen Belegexemplaren an die oben genannte
          Adresse erforderlich. Die Verwendung ist honorarfrei.
        </p>
      </div>
    </section>

    <section class="imprint__section">
      <h2>Haftungshinweis</h2>
      <div class="imprint__content">
        <p>
          Wir übernehmen keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind
          ausschließlich deren Betreiber verantwortlich.
        </p>

        <p>
          Wir sind bemüht, das Webangebot stets aktuell und inhaltlich richtig sowie vollständig anzubieten.
          Dennoch ist das Auftreten von Fehlern nicht völlig auszuschließen. Das Fraunhofer-Institut bzw. die
          Fraunhofer-Gesellschaft übernimmt keine Haftung für die Aktualität, die inhaltliche Richtigkeit sowie
          für die Vollständigkeit der in ihrem Webangebot eingestellten Informationen. Dies bezieht sich auf
          eventuelle Schäden materieller oder ideeller Art Dritter, die durch die Nutzung dieses Webangebotes
          verursacht wurden.
        </p>

        <p>
          Geschützte Marken und Namen, Bilder und Texte werden auf unseren Seiten in der Regel nicht als solche
          kenntlich gemacht. Das Fehlen einer solchen Kennzeichnung bedeutet jedoch nicht, dass es sich um einen
          freien Namen, ein freies Bild oder einen freien Text im Sinne des Markenzeichenrechts handelt.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.imprint {
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  line-height: 1.6;
}

.imprint__header {
  margin-bottom: 1rem;
}

.imprint h1 {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0;
}

.imprint__section {
  margin-top: 1.75rem;
}

.imprint h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.75rem;
}

.imprint__content p {
  margin: 0.5rem 0 0.75rem;
}

.imprint a {
  color: var(--primary);
}

.imprint em {
  display: block;
  margin-top: 0.35rem;
  font-style: italic;
  opacity: 0.9;
}
</style>
