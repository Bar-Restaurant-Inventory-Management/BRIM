using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BRIM.BackendClassLibrary
{
    public class NotificationManager: IObservable<Notification>
    {
        private int currentID = 0;
        private Notification latest;
        private List<Notification> notifications = new List<Notification>();
        private List<IObserver<Notification>> observers = new List<IObserver<Notification>>();

        public IDisposable Subscribe(IObserver<Notification> observer)
        {
            if (! observers.Contains(observer))
                observers.Add(observer);
            return new Unsubscriber(observers,observer);
        }

        public void AddNotification(string message)
        {
            Notification notification=new Notification(currentID, message);
            notifications.Add(notification);
            latest = notification;
            currentID++;
            foreach (var o in observers){
                o.OnNext(notification);
            }

        }

        public void RemoveNotification(int id)
        {
           notifications.Remove(notifications.Where(n => n.ID == id).First());
        }
        
        public void MarkRead(int id)
        {
            notifications.Where(n => n.ID == id).First().StatusCode=1;
        }

        public Notification GetMostRecent()
        {
            return latest;
        }

        private class Unsubscriber: IDisposable
        {
            private List<IObserver<Notification>> _observers;
            private IObserver<Notification> _observer;
            public Unsubscriber(List<IObserver<Notification>> observers, IObserver<Notification> observer)
            {
                this._observers = observers;
                this._observer=observer;
            }
            public void Dispose()
            {
                if(_observer != null && _observers.Contains(_observer))
                    _observers.Remove(_observer);
            }
        }
    }
}
