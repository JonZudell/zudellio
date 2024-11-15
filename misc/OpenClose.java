import ./Output;



public class OpenClose {

  public static void main(String[] args) {
    OpenClose oc = new OpenClose();
    oc.publicMethod();
  }

  public void publicMethod() {
    System.out.println("This is a public method.");
    privateMethod();
  }

  private void privateMethod() {
    System.out.println("This is a private method.");
  }
}

