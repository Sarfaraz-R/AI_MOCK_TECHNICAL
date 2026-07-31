"use client";
import { db } from "@/utils/db";
import { Newsletter } from "@/utils/schema";
import { LoaderCircle } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { toast } from "sonner";

const Contect = () => {
  const handleInputChange = (setState) => (e) => {
    setState(e.target.value);
  };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (name && email && message) {
      setLoading(true);
      try {
        // Store in database
        const resp = await db.insert(Newsletter).values({
          newName: name,
          newEmail: email,
          newMessage: message,
          createdAt: moment().format("YYYY-MM-DD"),
        });

        // Send email
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, message }),
        });

        const emailResult = await emailResponse.json();

        if (resp && emailResult.success) {
          toast.success("Message sent successfully!");
          setName("");
          setEmail("");
          setMessage("");
        } else {
          toast.error("Error sending message");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error sending message");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please fill in all fields");
    }
  };

  return (
    <div className="mx-auto text-center">
      <div className="mt-6">
        <form onSubmit={onSubmit} className="max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={handleInputChange(setName)}
            className="premium-input mb-4"
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={handleInputChange(setEmail)}
            className="premium-input mb-4"
          />
          <textarea
            placeholder="Your Message"
            value={message}
            onChange={handleInputChange(setMessage)}
            className="premium-input mb-4"
            rows="4"
          />
          <button
            type="submit"
            disabled={loading}
            className="premium-button-primary px-5 py-3 text-sm"
          >
            {loading ? (
              <LoaderCircle className="animate-spin mx-auto" />
            ) : (
              "Send Message"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contect;
