import React, { useState } from 'react';
import { Plus, X, Building2, School, BookOpen, Check } from 'lucide-react';
import { BAUFaculty, BAUDepartment, BAUCourse, LanguageMode } from '../types';

interface BAUAdminAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  faculties: BAUFaculty[];
  departments: BAUDepartment[];
  onAddCourse: (newCourse: BAUCourse) => void;
  languageMode: LanguageMode;
}

export const BAUAdminAddModal: React.FC<BAUAdminAddModalProps> = ({
  isOpen,
  onClose,
  faculties,
  departments,
  onAddCourse,
  languageMode
}) => {
  const isBn = languageMode === 'bn';

  const [facultyId, setFacultyId] = useState(faculties[0]?.id || '');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || '');
  const [program, setProgram] = useState('B.Sc. Ag. (Hons.)');
  const [year, setYear] = useState(1);
  const [semester, setSemester] = useState(1);
  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [courseTitleBn, setCourseTitleBn] = useState('');
  const [credit, setCredit] = useState('3 (2+1)');
  const [description, setDescription] = useState('');
  const [topicsStr, setTopicsStr] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim() || !courseTitle.trim()) return;

    const selectedFac = faculties.find(f => f.id === facultyId);
    const selectedDept = departments.find(d => d.id === departmentId);

    const newCourse: BAUCourse = {
      id: `custom_course_${Date.now()}`,
      facultyId,
      facultyNameBn: selectedFac?.nameBn || '',
      facultyNameEn: selectedFac?.nameEn || '',
      departmentId,
      departmentNameBn: selectedDept?.nameBn || '',
      departmentNameEn: selectedDept?.nameEn || '',
      program,
      year,
      semester,
      courseCode: courseCode.toUpperCase().trim(),
      courseTitle: courseTitle.trim(),
      courseTitleBn: courseTitleBn.trim() || courseTitle.trim(),
      credit,
      courseType: 'Combined',
      description: description.trim() || 'No official description provided.',
      descriptionBn: description.trim() || 'কোনো অফিসিয়াল বিবরণ প্রদান করা হয়নি।',
      topics: topicsStr ? topicsStr.split(',').map(s => s.trim()) : ['Topic 1', 'Topic 2'],
      references: ['BAU Department Course Curriculum'],
      sourceName: 'User Added Academic Item',
      sourceURL: 'https://www.bau.edu.bd',
      lastVerified: new Date().toISOString().split('T')[0],
      verificationStatus: 'pending'
    };

    onAddCourse(newCourse);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden space-y-0 my-8">
        
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-emerald-900 text-white">
          <div className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">নতুন কোর্স যোগ করুন (Add New Course)</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl hover:bg-white/10 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">অনুষদ (Faculty)</label>
              <select
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
                className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
              >
                {faculties.map(f => (
                  <option key={f.id} value={f.id}>{f.nameBn}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">বিভাগ (Department)</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.nameBn}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">কোর্স কোড (Code)</label>
              <input
                type="text"
                placeholder="e.g. AGRO 201"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                required
                className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">ক্রেডিট (Credit)</label>
              <input
                type="text"
                placeholder="3 (2+1)"
                value={credit}
                onChange={(e) => setCredit(e.target.value)}
                className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">বর্ষ / সেমিস্টার</label>
              <div className="flex space-x-1 mt-1">
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold"
                >
                  <option value="1">L-1</option>
                  <option value="2">L-2</option>
                  <option value="3">L-3</option>
                  <option value="4">L-4</option>
                </select>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold"
                >
                  <option value="1">S-1</option>
                  <option value="2">S-2</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">কোর্স টাইটেল (English)</label>
            <input
              type="text"
              placeholder="e.g. Crop Physiology and Ecology"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              required
              className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">কোর্স টাইটেল (বাংলা)</label>
            <input
              type="text"
              placeholder="e.g. ফসল শারীরবিদ্যা ও বাস্তুসংস্থান"
              value={courseTitleBn}
              onChange={(e) => setCourseTitleBn(e.target.value)}
              className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">টপিকসমূহ (কমা দিয়ে লিখুন)</label>
            <input
              type="text"
              placeholder="Photosynthesis, Respiration, Transpiration, Plant Hormones"
              value={topicsStr}
              onChange={(e) => setTopicsStr(e.target.value)}
              className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">কোর্স বিবরণ (Description)</label>
            <textarea
              rows={2}
              placeholder="Brief overview of course..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-lg transition-all"
          >
            ডাটাবেজে সেভ করুন (Save Course)
          </button>

        </form>

      </div>
    </div>
  );
};
