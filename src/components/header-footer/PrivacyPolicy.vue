<template>
  <div class="privacy-policy">
    <div id="divDSI">
      <!-- PFLICHTBAUSTEIN: Datenschutzinformation-->
      <h2><a name="_"> </a></h2>

      <h2>Datenschutzinformation</h2>

      <div id="divDSITitle">
        <h2>piveau demo</h2>
      </div>

      <p>
        Im Rahmen der Nutzung dieser Webseite werden personenbezogene Daten von Ihnen durch uns, als den für die
        Datenverarbeitung Verantwortlichen verarbeitet und für die Dauer gespeichert, die zur Erfüllung der festgelegten
        Zwecke und gesetzlicher Verpflichtungen erforderlich ist. Im Folgenden informieren wir Sie darüber, um welche
        Daten es sich dabei handelt, auf welche Weise sie verarbeitet werden und welche Rechte Ihnen diesbezüglich
        zustehen.
      </p>

      <p>
        Personenbezogene Daten sind gemäß Art. 4 Nr. 1 Datenschutzgrundverordnung (DSGVO) alle Informationen, die sich
        auf eine identifizierte oder identifizierbare natürliche Person beziehen.
      </p>
    </div>

    <nav id="divTableOfContents" aria-label="Inhaltsverzeichnis">
      <p><a href="#_geltungsbereich">1 Geltungsbereich</a></p>
      <p>
        <a
          href="#_name-und-kontaktdaten-des-fur-die-verarbeitung-verantwortlichen-sowie-des-betrieblichen-datenschutzbeauftragten"
        >2 Name und Kontaktdaten des für die Verarbeitung Verantwortlichen sowie des betrieblichen Datenschutzbeauftragten</a>
      </p>
      <p>
        <a href="#_verarbeitung-personenbezogener-daten-und-zwecke-der-verarbeitung"
        >3 Verarbeitung personenbezogener Daten und Zwecke der Verarbeitung</a>
      </p>
      <p class="toc-sub"><a href="#_keycloak-als-identity-provider">3.1 Keycloak als Identity Provider</a></p>
      <p><a href="#_weitergabe-von-daten">4 Weitergabe von Daten</a></p>
      <p><a href="#_betroffenenrechte">5 Betroffenenrechte</a></p>
      <p><a href="#_datensicherheit">6 Datensicherheit</a></p>
      <p>
        <a href="#_aktualitat-und-anderung-dieser-datenschutzinformation"
        >7 Aktualität und Änderung dieser Datenschutzinformation</a>
      </p>
    </nav>

    <div id="divScope">
      <!-- PFLICHTBAUSTEIN: Geltungsbereich -->

      <h2><a name="_geltungsbereich">1 Geltungsbereich</a></h2>

      <p>
        Diese Datenschutzinformation gilt für die Datenverarbeitung auf der Webpräsenz
        <a href="https://demo.piveau/"><strong>https://demo.piveau</strong></a>
        des <strong>Das Fraunhofer-Institut für Offene Kommunikationssysteme</strong>,
        die auf diese Datenschutzinformation Bezug nehmen.
      </p>
    </div>

    <div id="divContact">
      <!-- PFLICHTBAUSTEIN: Ansprechpartner -->

      <h2>
        <a
          name="_name-und-kontaktdaten-des-fur-die-verarbeitung-verantwortlichen-sowie-des-betrieblichen-datenschutzbeauftragten"
        >2 Name und Kontaktdaten des für die Verarbeitung Verantwortlichen sowie des betrieblichen Datenschutzbeauftragten</a>
      </h2>

      <p>Verantwortlicher ist:</p>

      <p>
        Fraunhofer-Gesellschaft
        <br>
        zur Förderung der angewandten Forschung e.V.
      </p>
      <p>
        Hansastraße 27 c
        <br>
        80686 München
      </p>

      <p>für ihr Das Fraunhofer-Institut für Offene Kommunikationssysteme</p>
      <p>Kaiserin-Augusta-Allee 31 10589 Berlin</p>

      <p>(im Folgenden <strong>Fraunhofer-FOKUS</strong>)</p>

      <div class="grid-table" style="display:grid; grid-template-columns:max-content auto;">
        <div>E-Mail:</div>
        <div><a href="mailto:info@fokus.fraunhofer.de">info@fokus.fraunhofer.de</a></div>
        <div>Telefon:&nbsp;</div>
        <div>+49 30 3463-7000</div>
      </div>

      <p>
        Der Datenschutzbeauftragte von Fraunhofer ist unter der o.g. Anschrift, zu Hd. Datenschutzbeauftragter bzw. unter
        <a href="mailto:datenschutz@zv.fraunhofer.de">datenschutz@zv.fraunhofer.de</a>
        erreichbar. Sie können sich jederzeit bei Fragen zum Datenschutzrecht oder Ihren Betroffenenrechten direkt an
        unseren Datenschutzbeauftragten wenden.
      </p>

      <p>
        Alternativ steht Ihnen unser Ansprechpartner webteam unter
        <a href="mailto:webteam(at)fokus.fraunhofer.de">webteam(at)fokus.fraunhofer.de</a>
        zur Verfügung.
      </p>
    </div>

    <div id="divDataProcessing">
      <h2><a name="_verarbeitung-personenbezogener-daten-und-zwecke-der-verarbeitung">3 Verarbeitung personenbezogener Daten und Zwecke der Verarbeitung</a></h2>

      <h3><a name="_keycloak-als-identity-provider">Keycloak als Identity Provider</a></h3>
      <p>
        Für die Anmeldung und Verwaltung von Benutzerkonten nutzen wir Keycloak als Identity Provider. Dabei verarbeitet
        Keycloak die für die Authentifizierung erforderlichen Daten (z.B. Benutzername, E-Mail-Adresse sowie technische
        Identifikationsmerkmale). Die Verarbeitung erfolgt zur Bereitstellung des Login- und Kontoservices.
      </p>
      <p>
        Im Rahmen der Anmeldung werden Authentifizierungsereignisse protokolliert (z.B. Zeitpunkt der Anmeldung, Erfolg
        oder Fehlschlag, IP-Adresse, verwendeter Client/Browser). Diese Protokolle dienen der Sicherheit, Fehleranalyse
        und dem Schutz vor Missbrauch.
      </p>
      <p>
        Zudem setzt Keycloak Session-Daten und Session-Cookies, um den Anmeldevorgang und die laufende Sitzung technisch
        zu ermöglichen. Die Session-Daten werden nach Ablauf der Sitzung oder gemäß konfigurierter Aufbewahrungsfristen
        automatisch entfernt.
      </p>
      <hr>
    </div>

    <div id="divPersonalData">
      <!-- PFLICHTBAUSTEIN verarbeitung personenbezogene daten, beim Besuch der Website/loeschfristen -->
      <h3>Beim Besuch der Webseite</h3>
      <div>
        <p>
          Wenn Sie unsere Webseite aufrufen und auf deren Inhalte zugreifen, werden vorübergehend Daten gespeichert, die
          möglicherweise eine Identifizierung zulassen. Der auf Ihrem Endgerät eingesetzte Browser sendet dabei
          automatisch die Informationen an den Server unserer Webseite. Die folgenden Daten werden hierbei erhoben:
        </p>

        <ul>
          <li>Datum und Uhrzeit des Zugriffs</li>
          <li>IP-Adresse</li>
          <li>Hostname des zugreifenden Servers</li>
          <li>Webseite, von welcher aus unserer Webseite aufgerufen wurde</li>
          <li>Besuchte Seite auf unserer Webseite</li>
          <li>Meldung, ob der Aufruf erfolgreich war</li>
          <li>Übertragene Datenmenge</li>
          <li>Informationen über den Browsertyp und die verwendete Version</li>
          <li>Betriebssystem</li>
        </ul>

        <p>
          Die vorübergehende Speicherung der Daten ist für den Verbindungsaufbau und den Ablauf eines Webseitenbesuchs
          erforderlich, damit wir Ihnen die Inhalte auf unserer Webseite bereitstellen können.
        </p>
        <p>
          Eine weitere Speicherung in Protokolldateien erfolgt, um die Funktionsfähigkeit der Webseite, die Sicherheit
          der informationstechnischen Systeme sicherzustellen und der störungsfreien Bereitstellung unserer Webseite
          sowie und etwaige rechtswidrige Angriffe hierauf notfalls verfolgen zu können.
        </p>
        <p>
          Wenn technische Daten aus Ihrem Endgeräte verarbeitet werden, um den Zugriff auf unsere Webseite ermöglichen,
          erfolgt dies, weil diese Daten gem. § 25 Abs. 1 Nr. 2 TDDDG erforderlich sind.
        </p>

        <!--
        <p>
            Sie können unsere Webseite aufrufen, ohne Angaben zu Ihrer Identität preisgeben zu müssen. Der auf Ihrem
            Endgerät eingesetzte Browser sendet lediglich automatisch Informationen an den Server unserer Webseite (z.B.
            Browsertyp und -version, Datum und Uhrzeit des Zugriffs), um einen Verbindungsaufbau der Webseite zu
            ermöglichen. Hierzu gehört auch die IP-Adresse Ihres anfragenden Endgerätes. Diese wird temporär in einem sog.
            Logfile gespeichert und spätestens nach 30 Tagen
            gelöscht.
        </p>
        -->

        <p>
          Die Verarbeitung der IP-Adresse erfolgt zu technischen und administrativen Zwecken, des Verbindungsaufbaus und
          –stabilität, um die Sicherheit und Funktionsfähigkeit unserer Webseite zu gewährleisten und etwaige
          rechtswidrige Angriffe hierauf notfalls verfolgen zu können. Die Rechtsgrundlage ist unser berechtigtes
          Interessen nach Art. 6 Abs. 1 lit. f DSGVO.
        </p>
        <p>
          Aus der Verarbeitung der genannten Daten in dem Logfile können wir keine unmittelbaren Rückschlüsse auf Ihre
          Identität ziehen. Diese wird temporär in einem sogenannten Logfile gespeichert und nach 30 Tagen gelöscht.
        </p>
        <p>
          <!-- Warum soll dieser Absatz nicht da sein, wenn die IP Anonymisiert wird? Was hat das mit Cookies und Analyse zu tun? Aber so stands in der MusterDSI-->
          Darüber hinaus setzen wir beim Besuch unserer Website ggf. Cookies sowie Analysedienste ein. Falls dies der
          Fall ist, erhalten Sie dazu nähere Erläuterungen in dieser Datenschutzinformation weiter unten.
        </p>
      </div>
    </div>

    <div id="divEventRegistration">
      <!-- Optional: Anmeldung Veranstaltungen -->
    </div>

    <div id="divNewsletter">
      <!-- Optional: Newsletter  -->
    </div>

    <div id="divContactForm">
      <!-- Optional: Kontaktformulare -->
    </div>

    <div id="divCommenting">
      <!-- Optional: Kommentarfunktionen -->
    </div>

    <div id="divOnlineShop">
      <!-- Optional: Online-Shop -->
    </div>

    <div id="divUserAccount">
      <!-- Optional: Benutzerkonto -->
    </div>

    <div id="divTransferOfData">
      <!-- PFLICHTBAUSTEIN: Weitergabe von Daten (AN DRITTE!)-->

      <h2><a name="_weitergabe-von-daten">4 Weitergabe von Daten</a></h2>
      <div>
        <p>
          Sofern wir personenbezogene Daten, die wir über die Webseite erheben, an Auftragsverarbeiter weitergeben,
          informieren wir Sie darüber in dieser Datenschutzinformation bei dem jeweiligen Datenverarbeitungsvorgang unter
          Nennung des konkreten Empfängers.
        </p>
        <p>Im Übrigen geben wir Ihre personenbezogenen Daten nur weiter, wenn</p>
        <ul>
          <li>
            Sie gem. Art. 6 Abs. 1 S. 1 lit. a DSGVO Ihre ausdrückliche Einwilligung dazu erteilt haben;
          </li>
          <li>
            dies gem. Art. 6 Abs. 1 S. 1 lit. b DSGVO für die Erfüllung eines Vertrages mit Ihnen erforderlich ist (zum
            Beispiel bei Weitergabe an Versandunternehmen zum Zwecke der Lieferung der von Ihnen bestellten Ware oder
            bei Weitergabe von Zahlungsdaten an Zahlungsdienstleister bzw. Kreditinstitute, um einen Zahlungsvorgang
            durchzuführen);
          </li>
          <li>
            für die Weitergabe nach Art. 6 Abs. 1 S. 1 lit. c DSGVO eine gesetzliche Verpflichtung besteht.
          </li>
        </ul>
        <p>
          Die weitergegebenen Daten dürfen von den Empfängern ausschließlich zu den genannten Zwecken verwendet werden.
        </p>
      </div>
    </div>

    <div id="divCookies">
      <!-- Social Optional: Cookies -->
    </div>

    <!-- Social Optional: Social Media Plugins -->

    <!-- endif SHOULD BE BELOW ALL SOCIALS  -->

    <div id="divYoutube">
      <!-- Social Optional: YouTube -->
    </div>

    <div id="divVimeo">
      <!-- Social Optional: Vimeo -->
    </div>

    <div id="divRightsOfSubjects">
      <!-- PFLICHTBAUSTEIN Betroffenenrechte -->

      <h2><a name="_betroffenenrechte">5 Betroffenenrechte</a></h2>
      <div>
        <p>Sie haben das Recht:</p>
        <ul>
          <li>
            gemäß Art. 7 Abs. 3 DSGVO Ihre einmal erteilte Einwilligung jederzeit gegenüber uns zu widerrufen. Dies hat
            zur Folge, dass wir die Datenverarbeitung, die auf dieser Einwilligung beruhte, für die Zukunft nicht mehr
            fortführen dürfen;
          </li>
          <li>
            gemäß Art. 15 DSGVO Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten zu verlangen.
            Insbesondere können Sie Auskunft über die Verarbeitungszwecke, die Kategorie der personenbezogenen Daten,
            die Kategorien von Empfängern, gegenüber denen Ihre Daten offengelegt wurden oder werden, die geplante
            Speicherdauer, das Bestehen eines Rechts auf Berichtigung, Löschung, Einschränkung der Verarbeitung oder
            Widerspruch, das Bestehen eines Beschwerderechts, die Herkunft ihrer Daten, sofern diese nicht bei uns erhoben
            wurden, sowie über das Bestehen einer automatisierten Entscheidungsfindung einschließlich Profiling und ggf.
            aussagekräftigen Informationen zu deren Einzelheiten verlangen;
          </li>
          <li>
            gemäß Art. 16 DSGVO unverzüglich die Berichtigung unrichtiger oder Vervollständigung Ihrer bei uns
            gespeicherten personenbezogenen Daten zu verlangen;
          </li>
          <li>
            gemäß Art. 17 DSGVO die Löschung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen, soweit
            nicht die Verarbeitung zur Ausübung des Rechts auf freie Meinungsäußerung und Information, zur Erfüllung einer
            rechtlichen Verpflichtung, aus Gründen des öffentlichen Interesses oder zur Geltendmachung, Ausübung oder
            Verteidigung von Rechtsansprüchen erforderlich ist;
          </li>
          <li>
            gemäß Art. 18 DSGVO die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen, soweit die
            Richtigkeit der Daten von Ihnen bestritten wird, die Verarbeitung unrechtmäßig ist, Sie aber deren Löschung
            ablehnen und wir die Daten nicht mehr benötigen, Sie jedoch diese zur Geltendmachung, Ausübung oder
            Verteidigung von Rechtsansprüchen benötigen oder Sie gemäß Art. 21 DSGVO Widerspruch gegen die Verarbeitung
            eingelegt haben;
          </li>
          <li>
            gemäß Art. 20 DSGVO Ihre personenbezogenen Daten, die Sie uns bereitgestellt haben, in einem strukturierten,
            gängigen und maschinenlesebaren Format zu erhalten oder die Übermittlung an einen anderen Verantwortlichen zu
            verlangen und
          </li>
          <li>
            gemäß Art. 77 DSGVO sich bei einer Aufsichtsbehörde zu beschweren. In der Regel können Sie sich hierfür an die
            Aufsichtsbehörde ihres üblichen Aufenthaltsortes oder Arbeitsplatzes oder unseres Vereinssitzes wenden.
          </li>
        </ul>
        <div id="divRightToObject" style="border:solid;">
          <div style="padding:0.5em;">
            <p>
              <strong>Information über Ihr Widerspruchsrecht nach Art. 21 DSGVO</strong>
            </p>
            <p>
              Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die
              Verarbeitung Sie betreffender personenbezogener Daten, die aufgrund von Artikel 6 Abs. 1 S. 1 lit. e DSGVO
              (Datenverarbeitung im öffentlichen Interesse) und Artikel 6 Abs. 1 S. 1 lit. f DSGVO (Datenverarbeitung auf
              der Grundlage einer Interessenabwägung) erfolgt, Widerspruch einzulegen; dies gilt auch für ein auf diese
              Bestimmung gestütztes Profiling von Artikel 4 Nr. 4 DSGVO.
            </p>
            <p>
              Legen Sie Widerspruch ein, werden wir Ihre personenbezogenen Daten nicht mehr verarbeiten, es sei denn, wir
              können zwingende schutzwürdige Gründe für die Verarbeitung nachweisen, die Ihre Interessen, Rechte und
              Freiheiten überwiegen, oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von
              Rechtsansprüchen.
            </p>
            <p>
              Sofern sich Ihr Widerspruch gegen eine Verarbeitung von Daten zum Zwecke der Direktwerbung richtet, so
              werden wir die Verarbeitung umgehend einstellen. In diesem Fall ist die Angabe einer besonderen Situation
              nicht erforderlich. Dies gilt auch für das Profiling, soweit es mit solcher Direktwerbung in Verbindung
              steht.
            </p>
            <p>
              Möchten Sie von Ihrem Widerspruchsrecht Gebrauch machen, genügt eine E-Mail an
              <a href="mailto:datenschutz@zv.fraunhofer.de">datenschutzkoordination@zv.fraunhofer.de</a>.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div id="divDataSecurity">
      <!-- PFLICHTBAUSTEIN datensicherheit -->

      <h2><a name="_datensicherheit">6 Datensicherheit</a></h2>
      <div>
        <p>
          Alle von Ihnen persönlich übermittelten Daten werden mit dem allgemein üblichen und sicheren Standard TLS
          (Transport Layer Security) verschlüsselt übertragen. TLS ist ein sicherer und erprobter Standard, der z.B. auch
          beim Onlinebanking Verwendung findet. Sie erkennen eine sichere TLS-Verbindung unter anderem an dem angehängten
          s am http (also https://..) in der Adressleiste Ihres Browsers oder am Schloss-Symbol im unteren Bereich Ihres
          Browsers.
        </p>
        <p>
          Wir bedienen uns im Übrigen geeigneter technischer und organisatorischer Sicherheitsmaßnahmen, um Ihre Daten
          gegen zufällige oder vorsätzliche Manipulationen, teilweisen oder vollständigen Verlust, Zerstörung oder gegen
          den unbefugten Zugriff Dritter zu schützen. Unsere Sicherheitsmaßnahmen werden entsprechend der technologischen
          Entwicklung fortlaufend verbessert.
        </p>
      </div>
    </div>

    <div id="divTimeliness">
      <!-- PFLICHTBAUSTEIN Aktualität-->

      <h2><a name="_aktualitat-und-anderung-dieser-datenschutzinformation">7 Aktualität und Änderung dieser Datenschutzinformation</a></h2>
      <div>
        <p>
          Durch die Weiterentwicklung unserer Webseite und Angebote darüber oder aufgrund geänderter gesetzlicher bzw.
          behördlicher Vorgaben kann es notwendig werden, diese Datenschutzinformation zu ändern. Die jeweils aktuelle
          Datenschutzinformation kann jederzeit auf unserer Webseite von Ihnen abgerufen und ausgedruckt werden.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.privacy-policy {
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  line-height: 1.6;
}

.privacy-policy h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.35rem;
  font-weight: 700;
}

.privacy-policy h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
  font-weight: 700;
}

.privacy-policy p {
  margin: 0.5rem 0 0.75rem;
}

.privacy-policy ul {
  margin: 0.25rem 0 1rem 1.25rem;
}

#divTableOfContents {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 0.75rem;
  padding: 1rem;
  margin: 1.5rem 0;
  background: rgba(0, 0, 0, 0.02);
}

#divTableOfContents p {
  margin: 0.25rem 0;
}

.toc-sub {
  margin-left: 1.25rem;
}
</style>

