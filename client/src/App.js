import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import TestStudentPage from './pages/TestStudentPage';
import TestTeacherPage from './pages/TestTeacherPage';
import ProtectedRoute from './components/ProtectedRoute';
import UnauthorizedPage from './pages/UnauthorizedPage';
import MyProfilePage from './pages/MyProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import BecomeTutorPage from './pages/BecomeTutorPage';
import ListingsPage from './pages/ListingsPage';
import CreateListingPage from './pages/CreateListingPage';
import ListingDetail from './pages/ListingDetail';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyListingsPage from './pages/MyListingsPage';
import ReservationPage from './pages/ReservationPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminListings from './pages/AdminListings';
import AdminMessages from './pages/AdminMessages';
import AdminOpinions from './pages/AdminOpinions.js';
import AdminStatistics from './pages/AdminStatistics';
import AdminArticles from './pages/AdminArticles';
import MyReservationsPage from './pages/MyReservationsPage'
import ProfilePage from './pages/ProfilePage';
import MessagePage from './pages/MessagePage';
import TeacherReservationsPage from './pages/TeacherReservationPage';
import MessageSendPage from './pages/MessegeSendPage.js';
import ArticleDetail from './pages/ArticleDetail';
import ConversationDetail from './pages/ConversationDetail';
import BalancePage from './pages/BalancePage.js';
import GiftcardPage from './pages/GiftcardPage.js';
import PromoteListingPage from './pages/PromoteListingPage.js';
import QuestionsPage from './pages/QuestionsPage';
import CreateQuestionPage from './pages/CreateQuestionsPage';
import QuestionDetail from './pages/QuestionDetail';
import TopUpBalancePage from './pages/TopUpBalancePage'; 
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import WithdrawPage from './pages/WithdrawPage';
import AdminPayments from './pages/AdminPayments';
import PaymentHistoryPage from "./pages/PaymentHistoryPage";
import MyQuestionsPage from './pages/MyQuestionsPage';
import AdminQuestions from './pages/AdminQuestions';


function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="d-flex flex-column min-vh-100">

                    <Navbar />
                    <div className="flex-grow-1">
                        <PayPalScriptProvider options={{ "client-id": "ARE3Wl7LARZAQL-thi-KNeGiQO-wSE2xQQWaiCa5teF-cexe1Evs8PGWwbU-0KCfxeQbcAnMn9A7sbyC", currency: "PLN" }}>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/ogloszenia/:id" element={<ListingDetail />} />
                                <Route path="/nieautoryzowany-dostep" element={<UnauthorizedPage />} />
                                <Route path="/zostan-korepetytorem" element={<BecomeTutorPage />} />
                                <Route path="/contact" element={<ContactPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/listing/:id" element={<ListingDetail />} />
                                <Route path="/moje-ogloszenia" element={<MyListingsPage />} />
                                <Route path="/ogloszenia/korepetytorzy" element={<ListingsPage />} />
                                <Route path="/artykul/:id" element={<ArticleDetail />} />
                                <Route path="/pytania/uczniowie" element={<QuestionsPage />} />
                                <Route path="/pytanie/:questionId" element={<QuestionDetail />} />
                                <Route path='/profil/:id' element={<ProfilePage />} />
                                { }
                                <Route element={<ProtectedRoute allowedRoles={['Uczeń', 'Nauczyciel']} />}>
                                    <Route path="/rezerwacja/:id" element={<ReservationPage />} />
                                    <Route path="/wiadomosci" element={<MessagePage />} />
                                    <Route path="/wiadomosc/:userId" element={<MessageSendPage />} />
                                    <Route path="/conversations/:id" element={<ConversationDetail />} />
                                    <Route path="/saldo-konta" element={<BalancePage />} />
                                    <Route path="/saldo-konta/doladuj" element={<TopUpBalancePage />} />
                                    <Route path="/saldo-konta/wyplac" element={<WithdrawPage />} />
                                    <Route path="/saldo-konta/kody-promocyjne" element={<GiftcardPage />} />
                                    <Route path="/promuj/:listingId" element={<PromoteListingPage />} />
                                     <Route path="/saldo-konta/historia-wyplat"element={<PaymentHistoryPage />}/>
                                </Route>

                                <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                                    <Route path="/admin" element={<AdminDashboard />} />
                                    <Route path="/admin/users" element={<AdminUsers />} />
                                    <Route path="/admin/listings" element={<AdminListings />} />
                                    <Route path="/admin/messages" element={<AdminMessages />} />
                                    <Route path="/admin/opinions" element={<AdminOpinions />} />
                                    <Route path="/admin/statistics" element={<AdminStatistics />} />
                                    <Route path="/admin/articles" element={<AdminArticles />} />
                                    <Route path="/admin/payments" element={<AdminPayments />} />
                                    <Route path="/admin/questions" element={<AdminQuestions />} />
                                </Route>

                                {/* Chronione trasy dla Uczniów */}
                                <Route element={<ProtectedRoute allowedRoles={['Uczeń']} />}>
                                    <Route path="/testStudent" element={<TestStudentPage />} />

                                    <Route path="/moje-rezerwacje" element={<MyReservationsPage />} />
                                    <Route path="/dodaj-pytanie" element={<CreateQuestionPage />} />

                                    <Route path="/moje-pytania" element={<MyQuestionsPage /> } /> 
                                </Route>

                                {/* Chronione trasy dla Nauczycieli */}
                                <Route element={<ProtectedRoute allowedRoles={['Nauczyciel']} />}>
                                <Route path="/moje-rezerwacje-nauczyciel" element={<TeacherReservationsPage />} />
                                    <Route path="/testTeacher" element={<TestTeacherPage />} />
                                    <Route path="/dodaj-ogloszenie" element={<CreateListingPage />} />
                                </Route>

                                <Route element={<ProtectedRoute allowedRoles={['Uczeń', 'Nauczyciel', 'Admin']} />} >
                                    <Route path="/myprofile" element={<MyProfilePage />} />
                                </Route>

                                {/* Trasa dla nieznanych ścieżek */}
                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                        </PayPalScriptProvider>
                    </div>
                    <Footer />
                </div>
            </Router>
        </AuthProvider >
    );
}

export default App;