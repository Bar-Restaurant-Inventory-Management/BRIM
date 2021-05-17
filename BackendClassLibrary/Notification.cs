using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BRIM.BackendClassLibrary
{
    public class Notification
    {
        public int ID{get;set;}
        public int StatusCode = 0;
        public string message{get;set;}

        public Notification(int id, string message)
        {
            this.ID = id;
            this.message = message;
        }
    }
}
