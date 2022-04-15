Individuellt projektarbete - BookDucks

Du har fått i uppdrag att ta fram en applikation för ett community vid namn BookDucks som lånar/utbyter böcker och ljudböcker på CD med varandra.

Backend

Du ska använda Strapi som CMS.
Genom CMS-gränssnittet ska man kunna lägga till:
En bok med dess titel, författare, antal sidor, betyg (valfri skala t.ex 1-10), samt en bild på bokomslaget.
En ljudbok med dess titel, utgivningsdatum, längd, betyg (valfri skala t.ex 1-10), samt en bild på bokomslaget.
Samtliga böcker och ljudböcker ska även vara kopplade till en registrerad användare som lånar ut boken/ljudboken. (Du kan skapa upp användare med Strapis inbyggda User-collection type).
(VG) Samtliga böcker och ljudböcker ska även ha en eller flera av följande genrer: Romantik, humor, skräck, barnvänlig, fantasy, sci-fi, action. (Skapa en content-type för dina genrer. Du kan också skapa egna genrer om du vill.

Frontend

Användaren ska kunna se en lista på samtliga böcker och ljudböcker som finns tillgängliga för utlåning. Skriv ut samtliga egenskaper för böckerna/ljudböckerna. Skriv även ut kontaktuppgifter för användaren som lånar ut boken/ljudboken (användarnamn samt email).
Det ska vara möjligt för en användare att logga in samt registrera sig på sidan.
Det ska tydligt framgå om användaren är inloggad i applikationen.
Det ska finnas en profilsida - Denna sida ska dock kräva inloggning för att visas.
Profilsidan som visar information om användarens användarnamn, email, id, samt vilket datum användaren registrerade sig. (VG) Sidan ska även innehålla en lista över samtliga böcker och ljudböcker som användaren har lagt ut för utlåning.
(VG) - Det ska även finnas ytterligare en sida där registrerade användare kan lägga ut böcker och ljudböcker för utlåning. Denna sida ska kräva att användaren är inloggad. Se till att användaren kan lägga till samtliga egenskaper för boken/ljudboken, inklusive bild på bokomslag och genrer. 

Sidan ska ha ett professionellt utseende.
Sidan ska fungera utan några större buggar.



Inlämningen ska ske i form av en .zip-fil eller en publik github-länk.
Döp filen till CMS_Projekt_förnamn_efternamn.zip
Inlämning senast 20 april.


Ang user-relations:

OBS! För er som påbörjat projektarbetet kommer ni märka att det inte går inte att hämta ut relations från er User-Collection Type för att koppla till böcker
- Kan tipsa er redan nu om att ni kan sätta ett userId istället på varje bok och hämta information med ert id mot /api/users/:id. Ni behöver då tillåta anrop till denna route i Settings som vanligt, ligger under Roles -> Authenticated/Public -> Users-permissions -> User -> Select All. 