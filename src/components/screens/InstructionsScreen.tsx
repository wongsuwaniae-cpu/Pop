import React from 'react';
import { ArrowLeft, Play, Layers, Clock, HelpCircle, CheckCircle2, Award, AlertCircle, RefreshCw } from 'lucide-react';
import { PrimaryButton } from '../common/PrimaryButton';
import { SecondaryButton } from '../common/SecondaryButton';

interface InstructionsScreenProps {
  onStartGame: () => void;
  onBack: () => void;
}

export const InstructionsScreen: React.FC<InstructionsScreenProps> = ({
  onStartGame,
  onBack,
}) => {
  const steps = [
    {
      num: 1,
      titleTh: 'เลือกชุดเกม (Select Game Set)',
      descTh: 'เลือกชุดคำศัพท์บทเรียนที่ต้องการศึกษา เช่น ส่วนประกอบพื้นฐาน, จับคู่ภาษาไทย–อังกฤษ หรือภาพกับคำศัพท์',
      icon: <Layers className="w-5 h-5 text-emerald-700" />,
    },
    {
      num: 2,
      titleTh: 'เลือกรูปแบบการจับคู่ (Select Matching Mode)',
      descTh: 'กำหนดว่าต้องการจับคู่ภาพกับภาษาไทย, ภาพกับภาษาอังกฤษ หรือภาษาไทยกับภาษาอังกฤษ (1 โหมดต่อ 1 รอบการเล่น)',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-700" />,
    },
    {
      num: 3,
      titleTh: 'เลือกระดับความยาก (Select Difficulty)',
      descTh: 'ระดับง่าย (Easy: 3 คู่), ระดับปานกลาง (Medium: 4–6 คู่), หรือระดับท้าทาย (Hard: 6 คู่)',
      icon: <Award className="w-5 h-5 text-emerald-700" />,
    },
    {
      num: 4,
      titleTh: 'เลือกเปิด/ปิด ตัวจับเวลา (Timer Mode)',
      descTh: 'เลือกเปิดจับเวลา 60 วินาทีเพื่อความท้าทาย หรือปิดจับเวลาเพื่อการเรียนรู้แบบผ่อนคลาย',
      icon: <Clock className="w-5 h-5 text-emerald-700" />,
    },
    {
      num: 5,
      titleTh: 'เริ่มเกมและการจับคู่ (Gameplay)',
      descTh: 'คลิกหรือแตะเลือกการ์ด 2 ใบที่สัมพันธ์กัน เช่น รูปรากพืช กับคำว่า "ราก" หรือ "Root"',
      icon: <Play className="w-5 h-5 text-emerald-700" />,
    },
    {
      num: 6,
      titleTh: 'กติกาการให้คะแนนและคำใบ้ (Scoring & Hints)',
      descTh: 'จับคู่ถูกต้องจะล็อกการ์ดและได้คะแนน หากจับคู่ผิดการ์ดจะพลิกกลับเพื่อให้ลองใหม่ การใช้คำใบ้ (Hint) สามารถช่วยนำทางได้',
      icon: <HelpCircle className="w-5 h-5 text-emerald-700" />,
    },
    {
      num: 7,
      titleTh: 'การสิ้นสุดเกมและสรุปผล (Game Completion)',
      descTh: 'เกมจะสิ้นสุดเมื่อจับคู่ครบทุกคู่ หรือหมดเวลาที่กำหนด จากนั้นจะแสดงผลคะแนนและความแม่นยำ',
      icon: <RefreshCw className="w-5 h-5 text-emerald-700" />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            วิธีเล่นเกม / How to Play
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            คู่มือการใช้งานและขั้นตอนการเล่นเกมจับคู่โครงสร้างพืช
          </p>
        </div>

        <SecondaryButton
          id="instructions-back-btn"
          onClick={onBack}
          icon={<ArrowLeft className="w-4 h-4" />}
          className="self-start sm:self-auto"
        >
          กลับ / Back
        </SecondaryButton>
      </div>

      {/* Steps List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((step) => (
          <div
            key={step.num}
            id={`instruction-step-${step.num}`}
            className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center font-bold text-base shrink-0">
              {step.num}
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-gray-900 text-base">{step.titleTh}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.descTh}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Educational Note */}
      <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 flex items-start gap-3.5">
        <AlertCircle className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
        <div className="text-sm text-emerald-900 leading-relaxed">
          <span className="font-bold">คำแนะนำสำหรับผู้เรียน:</span>{' '}
          การฝึกฝนคำศัพท์พฤกษศาสตร์ซ้ำๆ จะช่วยให้จดจำโครงสร้างอวัยวะพืช (Vegetative & Reproductive Organs) ได้อย่างแม่นยำ
          และสามารถนำไปประยุกต์ใช้ในการระบุเอกลักษณ์ของสมุนไพรและพืชยาในวิชาเภสัชพฤกษศาสตร์ได้ดียิ่งขึ้น
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <PrimaryButton
          id="instructions-start-btn"
          onClick={onStartGame}
          icon={<Play className="w-5 h-5 fill-current" />}
          className="w-full sm:w-auto px-8"
        >
          เข้าสู่การตั้งค่าเกม / Go to Setup
        </PrimaryButton>
        <SecondaryButton
          id="instructions-return-btn"
          onClick={onBack}
          icon={<ArrowLeft className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          กลับหน้าหลัก / Back to Home
        </SecondaryButton>
      </div>
    </div>
  );
};
