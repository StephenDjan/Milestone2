import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './advisingEntry.css';

const AdvisingEntry = () => {
    const [lastTerm, setLastTerm] = useState('');
    const [lastGPA, setLastGPA] = useState('');
    const [currentTerm, setCurrentTerm] = useState('');
    const [prerequisites, setPrerequisites] = useState([]);
    const [coursePlan, setCoursePlan] = useState([]);
    const [courses, setCourses] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch available courses from the database
    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/courses');
                setCourses(response.data);
            } catch (error) {
                setErrorMessage('Error fetching courses.');
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleAddPrerequisite = () => {
        setPrerequisites([...prerequisites, { course: '', level: '', id: Date.now() }]);
    };

    const handleAddCoursePlan = () => {
        setCoursePlan([...coursePlan, { course: '', level: '', id: Date.now() }]);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/api/advising/entry', {
                lastTerm,
                lastGPA,
                currentTerm,
                prerequisites,
                coursePlan
            });
            if (response.data.success) {
                alert('Advising entry submitted successfully!');
                setPrerequisites([]);
                setCoursePlan([]);
            } else {
                setErrorMessage(response.data.message || 'Submission failed.');
            }
        } catch (error) {
            setErrorMessage('Error submitting advising entry.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="advising-entry-container">
            <h2>Create Advising Entry</h2>

            {/* Last Term, Last GPA, and Current Term in the same row */}
            <div className="form-group row">
                <div className="form-item">
                    <label>Last Term</label>
                    <input
                        type="text"
                        placeholder="Last Term"
                        value={lastTerm}
                        onChange={(e) => setLastTerm(e.target.value)}
                    />
                </div>
                <div className="form-item">
                    <label>Last GPA</label>
                    <input
                        type="text"
                        placeholder="Last GPA"
                        value={lastGPA}
                        onChange={(e) => setLastGPA(e.target.value)}
                    />
                </div>
                <div className="form-item">
                    <label>Current Term</label>
                    <input
                        type="text"
                        placeholder="Current Term"
                        value={currentTerm}
                        onChange={(e) => setCurrentTerm(e.target.value)}
                    />
                </div>
            </div>

            <h3>Prerequisites</h3>
            {prerequisites.map((pre, index) => (
                <div key={pre.id} className="form-group">
                    <div className="form-item">
                        <label>Level</label>
                        <select
                            value={pre.level}
                            onChange={(e) => {
                                const updatedPre = [...prerequisites];
                                updatedPre[index].level = e.target.value;
                                setPrerequisites(updatedPre);
                            }}
                        >
                            <option value="">Select Level</option>
                            <option value="100">100</option>
                            <option value="200">200</option>
                            <option value="300">300</option>
                            <option value="400">400</option>
                        </select>
                    </div>
                    <div className="form-item">
                        <select
                            value={pre.course}
                            onChange={(e) => {
                                const updatedPre = [...prerequisites];
                                updatedPre[index].course = e.target.value;
                                setPrerequisites(updatedPre);
                            }}
                        >
                            <option value="">Select a prerequisite</option>
                            {Array.isArray(courses) && courses.map((course) => (
                                <option key={course.courseId} value={course.courseId}>
                                    {course.courseName} ({course.courseCode})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}
            <button className="btn add-btn" onClick={handleAddPrerequisite} disabled={loading}>
                {loading ? 'Loading...' : 'Add Prerequisite'}
            </button>

            <h3>Course Plan</h3>
            {coursePlan.map((course, index) => (
                <div key={course.id} className="form-group">
                    <div className="form-item">
                        <label>Level</label>
                        <select
                            value={course.level}
                            onChange={(e) => {
                                const updatedCourses = [...coursePlan];
                                updatedCourses[index].level = e.target.value;
                                setCoursePlan(updatedCourses);
                            }}
                        >
                            <option value="">Select Level</option>
                            <option value="100">100</option>
                            <option value="200">200</option>
                            <option value="300">300</option>
                            <option value="400">400</option>
                        </select>
                    </div>
                    <div className="form-item">
                        <select
                            value={course.course}
                            onChange={(e) => {
                                const updatedCourses = [...coursePlan];
                                updatedCourses[index].course = e.target.value;
                                setCoursePlan(updatedCourses);
                            }}
                        >
                            <option value="">Select a course</option>
                            {Array.isArray(courses) && courses.map((course) => (
                                <option key={course.courseId} value={course.courseId}>
                                    {course.courseName} ({course.courseCode})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}
            <button className="btn add-btn" onClick={handleAddCoursePlan} disabled={loading}>
                {loading ? 'Loading...' : 'Add Course Plan'}
            </button>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <button className="btn submit-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
            </button>
        </div>
    );
};

export default AdvisingEntry;
