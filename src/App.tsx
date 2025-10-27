import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import History from "./pages/History";
import Administration from "./pages/Administration";
import Departments from "./pages/Departments";
import DrivingSchool from "./pages/DrivingSchool";
import Accreditation from "./pages/Accreditation";
import Vacancies from "./pages/Vacancies";
import Contests from "./pages/Contests";
import SimpleTextPage from "./pages/SimpleTextPage";
import Pride from "./pages/Pride";
import License from "./pages/License";
import EducationalWork from "./pages/EducationalWork";
import Library from "./pages/Library";
import ELibrary from "./pages/ELibrary";
import IOS from "./pages/IOS";
import NOKO from "./pages/NOKO";
import Dormitory from "./pages/Dormitory";
import Cafeteria from "./pages/Cafeteria";
import SwimmingPool from "./pages/SwimmingPool";
import Workshops from "./pages/Workshops";
import InternalRules from "./pages/InternalRules";
import Schedule from "./pages/Schedule";
import BellSchedule from "./pages/BellSchedule";
import ClassroomLayout from "./pages/ClassroomLayout";
import Memo from "./pages/Memo";
import ExamSchedule from "./pages/ExamSchedule";
import PaymentReceipts from "./pages/PaymentReceipts";
import EducationCredit from "./pages/EducationCredit";
import StateExam from "./pages/StateExam";
import Courses from "./pages/Courses";
import OnlineSurvey from "./pages/OnlineSurvey";
import Professionals from "./pages/Professionals";
import AccessibleEnvironment from "./pages/AccessibleEnvironment";
import CitizenAppeals from "./pages/CitizenAppeals";
import CorruptionReport from "./pages/CorruptionReport";
import Documents from "./pages/Documents";
import AdmissionNumbers from "./pages/AdmissionNumbers";
import SelectionCommittee from "./pages/SelectionCommittee";
import OpenDay from "./pages/OpenDay";
import Specialties from "./pages/Specialties";
import AdmissionRules from "./pages/AdmissionRules";
import CareerMaps from "./pages/CareerMaps";
import RussiaBelarusConference from "./pages/RussiaBelarusConference";
import SferumMySchool from "./pages/SferumMySchool";
import RailwayEmployers from "./pages/RailwayEmployers";
import Anniversary95 from "./pages/Anniversary95";
import Victory80 from "./pages/Victory80";
import StartInScience from "./pages/StartInScience";
import AdminPanel from "./pages/AdminPanel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/history" element={<History />} />
          <Route path="/administration" element={<Administration />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/driving-school" element={<DrivingSchool />} />
          <Route path="/accreditation" element={<Accreditation />} />
          <Route path="/vacancies" element={<Vacancies />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/pride" element={<Pride />} />
          <Route path="/license" element={<License />} />
          <Route path="/educational-work" element={<EducationalWork />} />
          <Route path="/library" element={<Library />} />
          <Route path="/e-library" element={<ELibrary />} />
          <Route path="/ios" element={<IOS />} />
          <Route path="/noko" element={<NOKO />} />
          <Route path="/dormitory" element={<Dormitory />} />
          <Route path="/cafeteria" element={<Cafeteria />} />
          <Route path="/swimming-pool" element={<SwimmingPool />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/online-survey" element={<OnlineSurvey />} />
          
          {/* Student pages */}
          <Route path="/internal-rules" element={<InternalRules />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/bell-schedule" element={<BellSchedule />} />
          <Route path="/classroom-layout" element={<ClassroomLayout />} />
          <Route path="/memo" element={<Memo />} />
          <Route path="/exam-schedule" element={<ExamSchedule />} />
          <Route path="/payment-receipts" element={<PaymentReceipts />} />
          <Route path="/education-credit" element={<EducationCredit />} />
          <Route path="/state-exam" element={<StateExam />} />
          
          {/* Info block pages */}
          <Route path="/professionals" element={<Professionals />} />
          <Route path="/accessible-environment" element={<AccessibleEnvironment />} />
          <Route path="/citizen-appeals" element={<CitizenAppeals />} />
          <Route path="/corruption-report" element={<CorruptionReport />} />
          <Route path="/documents" element={<Documents />} />
          
          {/* Applicant pages */}
          <Route path="/applicants/admission-numbers" element={<AdmissionNumbers />} />
          <Route path="/applicants/selection-committee" element={<SelectionCommittee />} />
          <Route path="/applicants/open-day" element={<OpenDay />} />
          <Route path="/applicants/specialties" element={<Specialties />} />
          <Route path="/applicants/admission-rules" element={<AdmissionRules />} />
          <Route path="/applicants/career-maps" element={<CareerMaps />} />
          <Route path="/russia-belarus-conference" element={<RussiaBelarusConference />} />
          <Route path="/sferum-myschool" element={<SferumMySchool />} />
          <Route path="/railway-employers" element={<RailwayEmployers />} />
          <Route path="/anniversary-95" element={<Anniversary95 />} />
          <Route path="/victory-80" element={<Victory80 />} />
          <Route path="/start-in-science" element={<StartInScience />} />

          {/* Admin Panel */}
          <Route path="/admin" element={<AdminPanel />} />

          {/* Simple text pages */}

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
