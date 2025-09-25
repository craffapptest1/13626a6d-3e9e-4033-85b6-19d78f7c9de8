"use client";

import { useState, useEffect, useRef } from "react";
import { FiPlay, FiPause, FiRotateCcw, FiSettings, FiMaximize, FiMinimize } from "react-icons/fi";
import { Howl } from "howler";

export default function TimerPage() {
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [alarmSound, setAlarmSound] = useState("/alarm-sound.mp3");
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const alarmRef = useRef<Howl | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setIsRunning(false);
            playAlarm();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    alarmRef.current = new Howl({
      src: [alarmSound],
      loop: true,
      volume: 0.5,
    });

    return () => {
      if (alarmRef.current) {
        alarmRef.current.unload();
      }
    };
  }, [alarmSound]);

  const playAlarm = () => {
    if (alarmRef.current) {
      alarmRef.current.play();
      setIsAlarmPlaying(true);
    }
  };

  const stopAlarm = () => {
    if (alarmRef.current) {
      alarmRef.current.stop();
      setIsAlarmPlaying(false);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    if (isAlarmPlaying) {
      stopAlarm();
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(25 * 60);
    stopAlarm();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minutes = parseInt(e.target.value) || 0;
    setTime(minutes * 60);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">MiniTimer</h1>
            <button
              onClick={toggleFullscreen}
              className="text-gray-500 hover:text-primary-600 transition"
            >
              {isFullscreen ? <FiMinimize size={20} /> : <FiMaximize size={20} />}
            </button>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-7xl font-bold text-gray-800 mb-6">
              {formatTime(time)}
            </div>

            <div className="flex space-x-4 mb-6">
              <button
                onClick={toggleTimer}
                className={`flex items-center justify-center w-16 h-16 rounded-full ${
                  isRunning ? "bg-yellow-500" : "bg-primary-600"
                } text-white hover:opacity-90 transition`}
              >
                {isRunning ? <FiPause size={24} /> : <FiPlay size={24} />}
              </button>

              <button
                onClick={resetTimer}
                className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
              >
                <FiRotateCcw size={24} />
              </button>
            </div>

            <div className="w-full mb-6">
              <label htmlFor="minutes" className="block text-sm font-medium text-gray-700 mb-2">
                Set Timer (minutes)
              </label>
              <input
                type="number"
                id="minutes"
                min="1"
                max="120"
                value={Math.floor(time / 60)}
                onChange={handleTimeChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="w-full">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="alarm-sound" className="block text-sm font-medium text-gray-700">
                  Alarm Sound
                </label>
                <button
                  onClick={() => {
                    if (alarmRef.current) {
                      alarmRef.current.stop();
                      alarmRef.current.play();
                    }
                  }}
                  className="text-primary-600 hover:text-primary-700 transition"
                >
                  Test
                </button>
              </div>
              <select
                id="alarm-sound"
                value={alarmSound}
                onChange={(e) => setAlarmSound(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="/alarm-sound.mp3">Default Alarm</option>
                <option value="/alarm-sound-2.mp3">Gentle Bell</option>
                <option value="/alarm-sound-3.mp3">Digital Beep</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Timer Instructions</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-primary-600 mt-2 mr-2 flex-shrink-0"></span>
              Set your desired timer duration in minutes
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-primary-600 mt-2 mr-2 flex-shrink-0"></span>
              Click the play button to start the timer
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-primary-600 mt-2 mr-2 flex-shrink-0"></span>
              Use the reset button to stop the timer and reset to the original time
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-primary-600 mt-2 mr-2 flex-shrink-0"></span>
              Choose your preferred alarm sound from the dropdown
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-primary-600 mt-2 mr-2 flex-shrink-0"></span>
              Use the fullscreen button for a distraction-free timer view
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}