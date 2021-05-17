using System;
namespace BRIM.BackendClassLibrary
{
	public class NotificationWatcher:IObserver<Notification>
	{
		public virtual void Subscribe(IObservable<Notification> manager)
		{

		}
		public virtual void OnCompleted()
		{
			this.Unsubscribe();
		}
		public virtual void OnError(Exception e)
		{

		}
		public virtual void OnNext(Notification n)
		{

		}
		public virtual void Unsubscribe()
		{

		}
	}
}