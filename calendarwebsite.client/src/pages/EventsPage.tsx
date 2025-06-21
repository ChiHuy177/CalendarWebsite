import { useState, useEffect } from "react";
import Header from "../components/Header";
import EventCalendar from "../components/EventCalendar";
import { useTranslation } from 'react-i18next';
import LoadingSpinner from "@/components/loading-spinner";
import { UserInfo } from "../interfaces/type";

export default function EventsPage() {
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  async function fetchCurrentUser() {
    setLoading(true);
    try {
      // In a real application, you would fetch the current user from an authentication service
      // For now, we'll fetch the first user from the API
      const response = await fetch("/api/DataOnly_APIaCheckIn");
      if (response.ok) {
        const data: UserInfo[] = await response.json();
        if (data.length > 0) {
          setCurrentUser(data[0]); // Use the first user for demonstration
        }
      } else {
        console.error(t('events.message.fetchError'));
      }
    } catch (error) {
      console.error(`${t('events.message.fetchErrorDetails')}`, error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <Header />
      </div>

      {loading ? (
        <LoadingSpinner size="large" fullScreen={true} text={t('events.message.loadingData')} />
      ) : (
        <div className="min-h-screen py-6 flex flex-col items-center rounded-md shadow-sm">
          <div className="container mx-auto px-4 max-w-auto w-full">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">{t('events.title')}</h1>
              <p className="text-muted-foreground">
                {currentUser ? t('events.subtitle', { name: currentUser.fullName }) : t('events.subtitle.generic')}
              </p>
            </div>
            
            {currentUser ? (
              <EventCalendar userId={currentUser.id} />
            ) : (
              <div className="text-center py-8">
                <p>{t('events.noUser')}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}