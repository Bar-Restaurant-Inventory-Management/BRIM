using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;

namespace BRIM.BackendClassLibrary
{
    public class Tag
    {
        public int ID {get;set;}
        public string Name{get;set;}

        public Tag() { }

        public Tag(int id, string name)
        {
            ID = id;
            Name = name;
        }

        public Tag(DataRow dr)
        {
            try
            {
                ID = dr.Field<int>("ID");
                Name = dr.Field<string>("name");
            }
            catch (IndexOutOfRangeException exp)
            {
                Console.WriteLine("The Datarow given does not contain one or more of the columns in a Tag Object");
                Console.WriteLine(exp.Message);
            }
        }
    }
}
