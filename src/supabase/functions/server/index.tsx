import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-11376ee3/health", (c) => {
  return c.json({ status: "ok" });
});

// Chat session endpoints
app.post("/make-server-11376ee3/chat/session", async (c) => {
  try {
    const { userId, message, severity } = await c.req.json();
    const sessionId = `chat_session_${userId}_${Date.now()}`;
    
    const sessionData = {
      userId,
      message,
      severity,
      timestamp: new Date().toISOString(),
      type: 'chat'
    };
    
    await kv.set(sessionId, sessionData);
    
    // If high severity, also store in alerts
    if (severity === 'high') {
      const alertId = `alert_${userId}_${Date.now()}`;
      await kv.set(alertId, {
        ...sessionData,
        alertType: 'crisis',
        status: 'pending'
      });
    }
    
    return c.json({ success: true, sessionId });
  } catch (error) {
    console.log('Error saving chat session:', error);
    return c.json({ error: 'Failed to save session' }, 500);
  }
});

// Booking endpoints
app.post("/make-server-11376ee3/bookings", async (c) => {
  try {
    const booking = await c.req.json();
    const bookingId = `booking_${booking.userId}_${Date.now()}`;
    
    const bookingData = {
      ...booking,
      id: bookingId,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    
    await kv.set(bookingId, bookingData);
    
    return c.json({ success: true, booking: bookingData });
  } catch (error) {
    console.log('Error creating booking:', error);
    return c.json({ error: 'Failed to create booking' }, 500);
  }
});

app.get("/make-server-11376ee3/bookings/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const bookings = await kv.getByPrefix(`booking_${userId}`);
    
    return c.json({ bookings });
  } catch (error) {
    console.log('Error fetching bookings:', error);
    return c.json({ error: 'Failed to fetch bookings' }, 500);
  }
});

// Community posts endpoints
app.post("/make-server-11376ee3/community/posts", async (c) => {
  try {
    const post = await c.req.json();
    const postId = `post_${Date.now()}`;
    
    const postData = {
      ...post,
      id: postId,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: 0
    };
    
    await kv.set(postId, postData);
    
    return c.json({ success: true, post: postData });
  } catch (error) {
    console.log('Error creating post:', error);
    return c.json({ error: 'Failed to create post' }, 500);
  }
});

app.get("/make-server-11376ee3/community/posts", async (c) => {
  try {
    const posts = await kv.getByPrefix("post_");
    
    // Sort by timestamp (newest first)
    const sortedPosts = posts.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return c.json({ posts: sortedPosts });
  } catch (error) {
    console.log('Error fetching posts:', error);
    return c.json({ error: 'Failed to fetch posts' }, 500);
  }
});

// Admin analytics endpoints
app.get("/make-server-11376ee3/admin/analytics", async (c) => {
  try {
    const chatSessions = await kv.getByPrefix("chat_session_");
    const bookings = await kv.getByPrefix("booking_");
    const posts = await kv.getByPrefix("post_");
    const alerts = await kv.getByPrefix("alert_");
    
    // Calculate basic metrics
    const totalUsers = new Set([
      ...chatSessions.map(s => s.userId),
      ...bookings.map(b => b.userId)
    ]).size;
    
    const crisisAlerts = alerts.filter(a => a.alertType === 'crisis' && a.status === 'pending').length;
    
    const analytics = {
      totalUsers,
      totalChatSessions: chatSessions.length,
      totalBookings: bookings.length,
      totalPosts: posts.length,
      crisisAlerts,
      lastUpdated: new Date().toISOString()
    };
    
    return c.json({ analytics });
  } catch (error) {
    console.log('Error fetching analytics:', error);
    return c.json({ error: 'Failed to fetch analytics' }, 500);
  }
});

// Wellness tracking
app.post("/make-server-11376ee3/wellness/assessment", async (c) => {
  try {
    const assessment = await c.req.json();
    const now = new Date();
    const assessmentId = `assessment_${assessment.userId}_${now.getTime()}`;
    
    const assessmentData = {
      ...assessment,
      id: assessmentId,
      date: now.toISOString().split('T')[0], // Store date in YYYY-MM-DD format
      timestamp: now.toISOString()
    };
    
    await kv.set(assessmentId, assessmentData);
    
    return c.json({ success: true, assessment: assessmentData });
  } catch (error) {
    console.log('Error saving assessment:', error);
    return c.json({ error: 'Failed to save assessment' }, 500);
  }
});

app.get("/make-server-11376ee3/wellness/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const assessments = await kv.getByPrefix(`assessment_${userId}`);
    
    // Filter and validate assessments
    const validAssessments = assessments.filter(assessment => 
      assessment && 
      (assessment.timestamp || assessment.date) &&
      typeof assessment.score === 'number'
    );
    
    // Sort by timestamp (newest first)
    const sortedAssessments = validAssessments.sort((a, b) => {
      const timeA = new Date(a.timestamp || a.date || 0).getTime();
      const timeB = new Date(b.timestamp || b.date || 0).getTime();
      return timeB - timeA;
    });
    
    // Calculate wellness score based on latest assessment
    const wellnessScore = sortedAssessments.length > 0 ? 
      Math.min(Math.max(sortedAssessments[0].score || 75, 0), 100) : 
      75; // Default score
    
    return c.json({ 
      wellnessScore, 
      assessments: sortedAssessments 
    });
  } catch (error) {
    console.log('Error fetching wellness data:', error);
    return c.json({ 
      wellnessScore: 75, 
      assessments: [],
      error: 'Failed to fetch wellness data' 
    }, 500);
  }
});

Deno.serve(app.fetch);