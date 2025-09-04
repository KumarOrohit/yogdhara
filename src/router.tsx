import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Layout from "./Layout";
import DashboardLayout from "./DashboardLayout";
import TeacherHome from "./pages/dashboard/teacher/home/Home";
import TeacherBatch from "./pages/dashboard/teacher/batch/Batch";
import Attendance from "./pages/dashboard/teacher/batch/Attendance";
import Student from "./pages/dashboard/teacher/batch/Student";
import Calendar from "./pages/dashboard/class/Class";
import BatchPromotionPage from "./pages/dashboard/teacher/promotion/Promotion";
import Cryptic from "./pages/dashboard/teacher/cryptic/Cryptic";
import StudentDashboard from "./pages/dashboard/student/home/StudentHome";
import BatchStore from "./pages/dashboard/student/store/Store";
import StudentEnrolledBatches from "./pages/dashboard/student/batch/StudentBatch";
import YogaHub from "./pages/yogaHub/YogaHub";
import InstructorProfile from "./pages/dashboard/teacher/profile/Profile";
import SuccessPaymentPage from "./pages/payment/PaymentSuccess";
import StudentProfilePage from "./pages/dashboard/student/profile/Profile";
import TermsOfService from "./pages/termsofservie/TermsOfService";
import PrivacyPolicy from "./pages/privacypolicy/PrivacyPolicy";
import CustomerSupport from "./pages/customerSupport/CustomerSupport";
import CancellationRefundPolicy from "./pages/cancellationRefund/CancellationRefundPolicy";



const AppRoutes = () => (

    <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/yoga-hub" element={<Layout><YogaHub /></Layout>} />
        <Route path="/terms-of-service" element={<Layout><TermsOfService /></Layout>} />
        <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
        <Route path="/customer-support" element={<Layout><CustomerSupport /></Layout>} />
        <Route path="/canellation-refund" element={<Layout><CancellationRefundPolicy /></Layout>} />
        <Route path="/success/:paymentId" element={<Layout><SuccessPaymentPage /></Layout>} />

        <Route path="/dashboard/tea/home" element={<DashboardLayout><TeacherHome /></DashboardLayout>} />
        <Route path="/dashboard/tea/batch" element={<DashboardLayout><TeacherBatch /></DashboardLayout>} />
        <Route path="/dashboard/tea/batch/attendance/:batchId" element={<DashboardLayout><Attendance /></DashboardLayout>} />
        <Route path="/dashboard/tea/batch/students/:batchId" element={<DashboardLayout><Student /></DashboardLayout>} />
        <Route path="/dashboard/tea/class" element={<DashboardLayout><Calendar /></DashboardLayout>} />
        <Route path="/dashboard/tea/promotion" element={<DashboardLayout><BatchPromotionPage /></DashboardLayout>} />
        <Route path="/dashboard/tea/cryptic" element={<DashboardLayout><Cryptic /></DashboardLayout>} />
        <Route path="/dashboard/tea/profile" element={<DashboardLayout><InstructorProfile /></DashboardLayout>} />

        <Route path="/dashboard/stu/home" element={<DashboardLayout><StudentDashboard /></DashboardLayout>} />
        <Route path="/dashboard/stu/class" element={<DashboardLayout><Calendar /></DashboardLayout>} />
        <Route path="/dashboard/stu/store" element={<DashboardLayout><BatchStore /></DashboardLayout>} />
        <Route path="/dashboard/stu/batch" element={<DashboardLayout><StudentEnrolledBatches /></DashboardLayout>} />
        <Route path="/dashboard/stu/profile" element={<DashboardLayout><StudentProfilePage /></DashboardLayout>} />
    </Routes>

);

export default AppRoutes;