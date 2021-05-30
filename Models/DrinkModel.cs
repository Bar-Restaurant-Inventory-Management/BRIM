using System;
using System.Collections.Generic;
using BRIM.BackendClassLibrary;
namespace BRIM{



public class DrinkSubmissionModel{
	public string name{get;set;}
	public double estimate{get;set;}
	public double ideal{get;set;}
	public double par{get;set;}
	public string brand{get;set;}
	public double price{get;set;}
	public double size{get;set;}
	public double upc{get;set;}
	public double vintage{get;set;}
	public int units{get;set;}
	public int id{get;set;} 
	public List<Tag> tags{get;set;}

}

}