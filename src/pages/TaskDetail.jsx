import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({
    id: 1,
    title: 'Social Media Post',
    advertiser: 'John Marketing Co.',
    description: 'Create an engaging Instagram post about our new product launch. The post should include high-quality images, relevant hashtags, and compelling copy that drives engagement.',
    status: 'active',
    reward: 500,
    submissions: 12,
    requirements: [
      'Must have at least 1000 followers',
      'Post must include product image',
      'Use provided hashtags',
      'Tag our official account'
    ],
    createdAt: '2024-01-15'
  });

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button className="btn btn-outline mb-2" onClick={() => navigate('/tasks')}>
            <i className="fas fa-arrow-left"></i> Back to Tasks
          </button>
          <h1 className="card-title">{task.title}</h1>
        </div>
        <div className="d-flex gap-3">
          <button className="btn btn-primary" onClick={() => navigate(`/tasks/${id}/submissions`)}>
            <i className="fas fa-list"></i> View Submissions ({task.submissions})
          </button>
        </div>
      </div>

      <div className="card">
        <div className="row">
          <div className="col-md-8">
            <h3 className="card-title">Task Details</h3>
            <div className="mb-3">
              <strong>Advertiser:</strong> {task.advertiser}
            </div>
            <div className="mb-3">
              <strong>Description:</strong>
              <p className="mt-2">{task.description}</p>
            </div>
            <div className="mb-3">
              <strong>Requirements:</strong>
              <ul className="mt-2">
                {task.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-md-4">
            <h3 className="card-title">Task Info</h3>
            <div className="mb-3">
              <strong>Status:</strong>
              <span className={`badge ${
                task.status === 'active' ? 'badge-success' : 
                task.status === 'paused' ? 'badge-warning' : 
                'badge-primary'
              } ms-2`}>
                {task.status}
              </span>
            </div>
            <div className="mb-3">
              <strong>Reward:</strong> ₦{task.reward.toLocaleString()}
            </div>
            <div className="mb-3">
              <strong>Submissions:</strong> {task.submissions}
            </div>
            <div className="mb-3">
              <strong>Created:</strong> {new Date(task.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}