### Stan na dzień 23.10.2024
## Opis projektu
Przeznaczeniem strony internetowej jest umożliwienie uczniom łatwiejszego znalezienia korepetytorów z różnych dziedzin, 
Korepetytorzy również mogą znaleźć w prosty sposób uczniów potrzebujących pomocy w nauce. 
Nauczyciele jak i uczniowie mogą stworzyć swoje konta, dzięki którym uzyskają dostęp do wszystkich funkcjonalności strony.
## Funkcjonalności
- Rejestracja i logowanie użytkowników (uczeń, nauczyciel)
- Zarządzanie profilem użytkownika (każdy użytkownik niezależnie od roli może edhytować swoje dane, zmieniać hasło oraz usunąć konto w razie potrzeby)
- Role użytkowników: Uczniowie jak i nauczyciele posiadają różne funkcjonalności strony internetowej zależnie od roli
- Ochrona tras: Niektóre trasy są zabezpieczone i dostępne jedynie dla zalogowanych użytkowników, bądź użytkowników z konkretnymi rolami
## Technologie użyte w projekcie
- React - Biblioteka do budowania interfejsu użytkownika. Architektura pozwala na tworzenie komponentów użytych do wielokrotnego użycia
- React router - Jest to biblioteka do nawigacji w aplikacji React.
- Axios - Biblioteka do wykonywania żądań HTTP. Używana jest przeważnie w celu logowania, rejestracji, pobierania danych itd.
- Jest i React Testing Library - Biblioteki do testowania aplikacji, ułatwia proces weryfikacji poprawności działania.
- Bootstrap - Framework CSS, służy do stylizacji i układów strony, dzięki niej uzyskujemy w prosty sposób responsywność strony internetowej.
## Struktura projektu
- src 
- - components - Komponenty używane w aplikacji
- - pages - strony aplikacji
- - - tests - testy jednostkowe
- - App.js - główny plik aplikacji
## Uruchomienie projektu
Aby uruchomić projekt należy sklonować repozytorium
git clone <link>
Następnie zainstalować zależności

``` npm install ``` 

A następnie uruchomić aplikację 

``` npm start```

Aplikacja uruchomi się pod adresem http://localhost:3000 

## Testowanie
Projekt posiada testy jednostkowe oraz integracyjne, aby uruchomić testy należy użyć komendy 

``` npm test ```
